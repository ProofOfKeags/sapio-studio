import { equal } from 'assert';
import spawn from 'await-spawn';
import {
    ChildProcessWithoutNullStreams,
    spawn as spawnSync,
} from 'child_process';
import { JSONSchema7 } from 'json-schema';

import { app, dialog, shell } from 'electron';
import { sys } from 'typescript';
import { preferences, sapio_config_file } from './settings';
import path from 'path';
import * as Bitcoin from 'bitcoinjs-lib';
import { mkdir, readdir, writeFile } from 'fs/promises';
import { API, Result } from '../src/common/preload_interface';

const memo_apis = new Map();
const memo_logos = new Map();

class SapioCompiler {
    constructor() {}
    static async command(args: string[]): Promise<Result<string>> {
        const binary = preferences.data.sapio_cli.sapio_cli;
        const source = preferences.data.sapio_cli.preferences;
        let new_args: string[] = [];
        if (source === 'Default') {
            new_args = args;
        } else if ('File' in source) {
            new_args = ['--config', source.File, ...args];
        } else if ('Here' in source) {
            new_args = ['--config', sapio_config_file, ...args];
        } else {
            dialog.showErrorBox(
                'Improper Source',
                'This means your config file is corrupt, shutting down.'
            );
            sys.exit(1);
        }
        console.debug(['sapio'], binary, new_args);
        try {
            const ok = (await spawn(binary, new_args)).toString();
            return { ok };
        } catch (e: any) {
            return { err: e.toString() };
        }
    }

    async psbt_finalize(psbt: string): Promise<Result<string>> {
        return await SapioCompiler.command([
            'psbt',
            'finalize',
            '--psbt',
            psbt,
        ]);
    }

    async show_config(): Promise<Result<string>> {
        return await SapioCompiler.command(['configure', 'show']);
    }

    async list_contracts(): Promise<Result<API>> {
        const res = await SapioCompiler.command(['contract', 'list']);
        if ('err' in res) return res;
        const contracts = res.ok;
        const lines: Array<[string, string]> = contracts
            .trim()
            .split(/\r?\n/)
            .map((line: string) => {
                const v: string[] = line.split(' -- ')!;
                equal(v.length, 2);
                return v as [string, string];
            });

        const apis_p = Promise.all(
            lines.map(([name, key]: [string, string]): Promise<JSONSchema7> => {
                if (memo_apis.has(key)) {
                    return Promise.resolve(memo_apis.get(key));
                } else {
                    return SapioCompiler.command([
                        'contract',
                        'api',
                        '--key',
                        key,
                    ]).then((v) => {
                        if ('err' in v) return v;
                        const api = JSON.parse(v.ok);
                        memo_apis.set(key, api);
                        return api;
                    });
                }
            })
        );
        const logos_p = Promise.all(
            lines.map(
                ([name, key]: [string, string]): Promise<Result<string>> => {
                    if (memo_logos.has(key)) {
                        return Promise.resolve(memo_logos.get(key));
                    } else {
                        return SapioCompiler.command([
                            'contract',
                            'logo',
                            '--key',
                            key,
                        ])
                            .then((logo: Result<string>) => {
                                return 'ok' in logo
                                    ? { ok: logo.ok.trim() }
                                    : logo;
                            })
                            .then((logo: Result<string>) => {
                                if ('err' in logo) return logo;
                                memo_logos.set(key, logo);
                                return logo;
                            });
                    }
                }
            )
        );
        const [apis, logos] = await Promise.all([apis_p, logos_p]);

        const results: API = {};
        equal(lines.length, apis.length);
        equal(lines.length, logos.length);
        for (let i = 0; i < lines.length; ++i) {
            const [name, key] = lines[i]!;
            const api = apis[i]!;
            const logo = logos[i]!;
            if ('err' in logo) return logo;
            results[key] = {
                name,
                key,
                api,
                logo: logo.ok,
            };
        }
        return { ok: results };
    }
    async load_contract_file_name(file: string): Promise<{ ok: null }> {
        const child = await SapioCompiler.command([
            'contract',
            'load',
            '--file',
            file,
        ]);
        console.log(`child stdout:\n${child}`);
        return { ok: null };
    }

    async list_compiled_contracts(): Promise<string[]> {
        const file = path.join(app.getPath('userData'), 'compiled_contracts');
        const contracts = await readdir(file, { encoding: 'ascii' });
        return contracts;
    }
    async trash_compiled_contract(s: string): Promise<void> {
        const file = path.join(
            app.getPath('userData'),
            'compiled_contracts',
            s
        );
        return shell.trashItem(file);
    }

    async create_contract(
        which: string,
        args: string
    ): Promise<Result<string | null>> {
        let create, created, bound;
        const args_h = Bitcoin.crypto.sha256(Buffer.from(args)).toString('hex');
        // Unique File Name of Time + Args + Module
        const fname = `${which.substring(0, 16)}-${args_h.substring(
            0,
            16
        )}-${new Date().getTime()}`;
        const file = path.join(
            app.getPath('userData'),
            'compiled_contracts',
            fname
        );
        // technically a race condition
        await mkdir(file, { recursive: true });
        const write_str = (to: string, data: string) =>
            writeFile(path.join(file, to), data, { encoding: 'utf-8' });
        const w_arg = write_str('args.json', args);
        const w_mod = write_str(
            'module.json',
            JSON.stringify({ module: which })
        );
        const sc = await sapio.show_config();
        if ('err' in sc) return Promise.reject('Error getting config');
        const w_settings = write_str('settings.json', sc.ok);

        Promise.all([w_arg, w_mod, w_settings]);

        try {
            create = await SapioCompiler.command([
                'contract',
                'create',
                '--key',
                which,
                args,
            ]);
        } catch (e) {
            console.debug('Failed to Create', which, args);
            return { ok: null };
        }
        if ('err' in create) {
            write_str('create_error.json', JSON.stringify(create));
            return create;
        }
        created = create.ok;
        const w_create = write_str('create.json', create.ok);
        Promise.all([w_create]);
        let bind;
        try {
            bind = await SapioCompiler.command([
                'contract',
                'bind',
                '--base64_psbt',
                created,
            ]);
        } catch (e: any) {
            console.debug(created);
            console.log('Failed to bind', e.toString());
            return { ok: null };
        }
        if ('err' in bind) {
            write_str('bind_error.json', JSON.stringify(create));
            return bind;
        }
        const w_bound = write_str('bound.json', bind.ok);
        await w_bound;
        console.debug(bound);
        return bind;
    }
}

export const sapio = new SapioCompiler();

let g_emulator: null | ChildProcessWithoutNullStreams = null;
let g_emulator_log = '';

export function get_emulator_log(): string {
    return g_emulator_log;
}
export function start_sapio_oracle(): ChildProcessWithoutNullStreams | null {
    if (g_emulator !== null) return g_emulator;
    const oracle = preferences.data.local_oracle;
    if (oracle !== 'Disabled' && 'Enabled' in oracle) {
        const binary = preferences.data.sapio_cli.sapio_cli;
        const seed = oracle.Enabled.file;
        const iface = oracle.Enabled.interface;
        const emulator = spawnSync(binary, ['emulator', 'server', seed, iface]);
        if (emulator) {
            let quit = '';
            emulator.stderr.on('data', (data) => {
                quit += `${data}`;
            });
            emulator.on('exit', (code) => {
                if (quit !== '') {
                    console.error('Emulator Oracle Error', quit);
                    sys.exit();
                }
            });
            emulator.stdout.on('data', (data) => {
                g_emulator_log += `${data}`;
                console.log(`stdout: ${data}`);
            });
        }
        g_emulator = emulator;
        return g_emulator;
    }
    return null;
}

export function kill_emulator() {
    console.log('Killing Emulator');
    g_emulator_log = '';
    g_emulator?.kill();
    g_emulator = null;
}
