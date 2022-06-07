export type TupleOf_RequestAnd_Response = [Request, Response];
export type Command =
    | {
          List: List;
      }
    | {
          Call: Call;
      }
    | {
          Bind: Bind;
      }
    | {
          Api: Api;
      }
    | {
          Logo: Logo;
      }
    | {
          Info: Info;
      }
    | {
          Load: Load;
      };
export type List = null;
/**
 * Remote type Derivation for rpc::Auth TODO: Move to the RPC Library?
 */
export type Auth =
    | 'None'
    | {
          UserPass: [string, string];
      }
    | {
          CookieFile: string;
      };
/**
 * A type that handles (gracefully) the fact that certain widely used output types do not have an address
 */
export type ExtendedAddress = Address | OpReturn | Script;
export type Address = string;
/**
 * Internal type for processing OpReturn through serde
 */
export type OpReturn = Script;
/**
 * A Bitcoin script.
 */
export type Script = string;
export type PathFragment =
    | (
          | 'Root'
          | 'Cloned'
          | 'Action'
          | 'FinishFn'
          | 'CondCompIf'
          | 'Guard'
          | 'Next'
          | 'Suggested'
          | 'DefaultEffect'
          | 'Effects'
          | 'Metadata'
      )
    | {
          Branch: number;
      }
    | {
          Named: string;
      };
/**
 * A JSON Schema.
 */
export type Schema = boolean | SchemaObject;
/**
 * A type which can be serialized as a single item, or multiple items.
 *
 * In some contexts, a `Single` may be semantically distinct from a `Vec` containing only item.
 */
export type SingleOrVecFor_Schema = Schema | Schema[];
/**
 * A type which can be serialized as a single item, or multiple items.
 *
 * In some contexts, a `Single` may be semantically distinct from a `Vec` containing only item.
 */
export type SingleOrVecFor_InstanceType = InstanceType | InstanceType[];
/**
 * The possible types of values in JSON Schema documents.
 *
 * See [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).
 */
export type InstanceType =
    | 'null'
    | 'boolean'
    | 'object'
    | 'array'
    | 'number'
    | 'string'
    | 'integer';
/**
 * Multiple Types of Allowed Descriptor
 */
export type SupportedDescriptors = ECDSADescriptors | TaprootDescriptors;
export type Descriptor = string;
export type Policy = string;
/**
 * Output of the SHA256 hash function
 */
export type Hash = string;
export type OutPoint = string;
export type Witness = number[][];
export type Api = null;
export type Logo = null;
export type Info = null;
export type Load = null;
export type OsString =
    | {
          Unix: number[];
          [k: string]: unknown;
      }
    | {
          Windows: number[];
          [k: string]: unknown;
      };
export type ResultOf_CommandReturnOr_RequestError =
    | {
          Ok: CommandReturn;
          [k: string]: unknown;
      }
    | {
          Err: true;
          [k: string]: unknown;
      };
export type CommandReturn =
    | {
          List: ListReturn;
      }
    | {
          Call: CallReturn;
      }
    | {
          Bind: Program;
      }
    | {
          Api: ApiReturn;
      }
    | {
          Logo: LogoReturn;
      }
    | {
          Info: InfoReturn;
      }
    | {
          Load: LoadReturn;
      };
/**
 * Format for a Linked PSBT in Sapio Studio
 */
export type SapioStudioFormat = {
    linked_psbt: {
        /**
         * added metadata
         */
        added_output_metadata: OutputMeta[];
        /**
         * Hex encoded TXN
         */
        hex: string;
        /**
         * tx level metadata
         */
        metadata: TemplateMetadata;
        /**
         * output specific metadata
         */
        output_metadata: ObjectMetadata[];
        /**
         * Base 64 Encoded PSBT
         */
        psbt: string;
        [k: string]: unknown;
    };
};

export interface Request {
    command: Command;
    context: Common;
    [k: string]: unknown;
}
export interface Call {
    params: true;
    [k: string]: unknown;
}
export interface Bind {
    client_auth: Auth;
    client_url: string;
    compiled: Object;
    outpoint?: OutPoint | null;
    use_base64: boolean;
    use_mock: boolean;
    use_txn?: string | null;
    [k: string]: unknown;
}
/**
 * Object holds a contract's complete context required post-compilation There is no guarantee that Object is properly constructed presently.
 */
export interface Object {
    /**
     * The Object's address, or a Script if no address is possible
     */
    address: ExtendedAddress;
    /**
     * The amount_range safe to send this object
     */
    amount_range: AmountRange;
    /**
     * A Map of arguments to continue execution and generate an update at this point via a passed message
     */
    continuation_points?: {
        [k: string]: ContinuationPoint;
    };
    /**
     * The Object's descriptor -- if there is one known/available
     */
    known_descriptor?: SupportedDescriptors | null;
    /**
     * metadata generated for this contract
     */
    metadata: ObjectMetadata;
    /**
     * The base location for the set of continue_apis.
     */
    root_path: ReversePathFor_PathFragmentAnd_String;
    /**
     * a map of template hashes to the corresponding template, that in the policy are not necessarily CTV protected but we might want to know about anyways.
     */
    suggested_template_hash_to_template_map?: {
        [k: string]: Template;
    };
    /**
     * a map of template hashes to the corresponding template, that in the policy are a CTV protected
     */
    template_hash_to_template_map?: {
        [k: string]: Template;
    };
    [k: string]: unknown;
}
/**
 * `AmountRange` makes it simple to track and update the range of allowed values for a contract to receive.
 */
export interface AmountRange {
    max_btc?: number | null;
    min_btc?: number | null;
    [k: string]: unknown;
}
/**
 * Instructions for how to resume a contract compilation at a given point
 */
export interface ContinuationPoint {
    /**
     * The path at which this was compiled
     */
    path: ReversePathFor_PathFragmentAnd_String;
    /**
     * The arguments required at this point TODO: De-Duplicate repeated types?
     */
    schema?: RootSchema | null;
    [k: string]: unknown;
}
/**
 * Used to Build a Shared Path for all children of a given context.
 */
export interface ReversePathFor_PathFragmentAnd_String {
    _pd: null;
    past?: ReversePathFor_PathFragmentAnd_String | null;
    this: PathFragment;
    [k: string]: unknown;
}
/**
 * The root object of a JSON Schema document.
 */
export interface RootSchema {
    /**
     * The `$id` keyword.
     *
     * See [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).
     */
    $id?: string | null;
    /**
     * The `$ref` keyword.
     *
     * See [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).
     */
    $ref?: string | null;
    /**
     * The `$schema` keyword.
     *
     * See [JSON Schema 8.1.1. The "$schema" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.1.1).
     */
    $schema?: string | null;
    /**
     * The `additionalItems` keyword.
     *
     * See [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).
     */
    additionalItems?: Schema | null;
    /**
     * The `additionalProperties` keyword.
     *
     * See [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).
     */
    additionalProperties?: Schema | null;
    /**
     * The `allOf` keyword.
     *
     * See [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).
     */
    allOf?: Schema[] | null;
    /**
     * The `anyOf` keyword.
     *
     * See [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).
     */
    anyOf?: Schema[] | null;
    /**
     * The `const` keyword.
     *
     * See [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)
     */
    const?: {
        [k: string]: unknown;
    };
    /**
     * The `contains` keyword.
     *
     * See [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).
     */
    contains?: Schema | null;
    /**
     * The `default` keyword.
     *
     * See [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).
     */
    default?: {
        [k: string]: unknown;
    };
    /**
     * The `definitions` keyword.
     *
     * In JSON Schema draft 2019-09 this was replaced by $defs, but in Schemars this is still serialized as `definitions` for backward-compatibility.
     *
     * See [JSON Schema 8.2.5. Schema Re-Use With "$defs"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.5), and [JSON Schema (draft 07) 9. Schema Re-Use With "definitions"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9).
     */
    definitions?: {
        [k: string]: Schema;
    };
    /**
     * The `deprecated` keyword.
     *
     * See [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).
     */
    deprecated?: boolean;
    /**
     * The `description` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    description?: string | null;
    /**
     * The `else` keyword.
     *
     * See [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).
     */
    else?: Schema | null;
    /**
     * The `enum` keyword.
     *
     * See [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)
     */
    enum?: true[] | null;
    /**
     * The `examples` keyword.
     *
     * See [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).
     */
    examples?: true[];
    /**
     * The `exclusiveMaximum` keyword.
     *
     * See [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).
     */
    exclusiveMaximum?: number | null;
    /**
     * The `exclusiveMinimum` keyword.
     *
     * See [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).
     */
    exclusiveMinimum?: number | null;
    /**
     * The `format` keyword.
     *
     * See [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).
     */
    format?: string | null;
    /**
     * The `if` keyword.
     *
     * See [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).
     */
    if?: Schema | null;
    /**
     * The `items` keyword.
     *
     * See [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).
     */
    items?: SingleOrVecFor_Schema | null;
    /**
     * The `maxItems` keyword.
     *
     * See [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).
     */
    maxItems?: number | null;
    /**
     * The `maxLength` keyword.
     *
     * See [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).
     */
    maxLength?: number | null;
    /**
     * The `maxProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).
     */
    maxProperties?: number | null;
    /**
     * The `maximum` keyword.
     *
     * See [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).
     */
    maximum?: number | null;
    /**
     * The `minItems` keyword.
     *
     * See [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).
     */
    minItems?: number | null;
    /**
     * The `minLength` keyword.
     *
     * See [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).
     */
    minLength?: number | null;
    /**
     * The `minProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).
     */
    minProperties?: number | null;
    /**
     * The `minimum` keyword.
     *
     * See [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).
     */
    minimum?: number | null;
    /**
     * The `multipleOf` keyword.
     *
     * See [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).
     */
    multipleOf?: number | null;
    /**
     * The `not` keyword.
     *
     * See [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).
     */
    not?: Schema | null;
    /**
     * The `oneOf` keyword.
     *
     * See [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).
     */
    oneOf?: Schema[] | null;
    /**
     * The `pattern` keyword.
     *
     * See [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).
     */
    pattern?: string | null;
    /**
     * The `patternProperties` keyword.
     *
     * See [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).
     */
    patternProperties?: {
        [k: string]: Schema;
    };
    /**
     * The `properties` keyword.
     *
     * See [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).
     */
    properties?: {
        [k: string]: Schema;
    };
    /**
     * The `propertyNames` keyword.
     *
     * See [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).
     */
    propertyNames?: Schema | null;
    /**
     * The `readOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    readOnly?: boolean;
    /**
     * The `required` keyword.
     *
     * See [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).
     */
    required?: string[];
    /**
     * The `then` keyword.
     *
     * See [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).
     */
    then?: Schema | null;
    /**
     * The `title` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    title?: string | null;
    /**
     * The `type` keyword.
     *
     * See [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).
     */
    type?: SingleOrVecFor_InstanceType | null;
    /**
     * The `uniqueItems` keyword.
     *
     * See [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).
     */
    uniqueItems?: boolean | null;
    /**
     * The `writeOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    writeOnly?: boolean;
    [k: string]: unknown;
}
/**
 * A JSON Schema object.
 */
export interface SchemaObject {
    /**
     * The `$id` keyword.
     *
     * See [JSON Schema 8.2.2. The "$id" Keyword](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.2).
     */
    $id?: string | null;
    /**
     * The `$ref` keyword.
     *
     * See [JSON Schema 8.2.4.1. Direct References with "$ref"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-8.2.4.1).
     */
    $ref?: string | null;
    /**
     * The `additionalItems` keyword.
     *
     * See [JSON Schema 9.3.1.2. "additionalItems"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.2).
     */
    additionalItems?: Schema | null;
    /**
     * The `additionalProperties` keyword.
     *
     * See [JSON Schema 9.3.2.3. "additionalProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.3).
     */
    additionalProperties?: Schema | null;
    /**
     * The `allOf` keyword.
     *
     * See [JSON Schema 9.2.1.1. "allOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.1).
     */
    allOf?: Schema[] | null;
    /**
     * The `anyOf` keyword.
     *
     * See [JSON Schema 9.2.1.2. "anyOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.2).
     */
    anyOf?: Schema[] | null;
    /**
     * The `const` keyword.
     *
     * See [JSON Schema Validation 6.1.3. "const"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.3)
     */
    const?: {
        [k: string]: unknown;
    };
    /**
     * The `contains` keyword.
     *
     * See [JSON Schema 9.3.1.4. "contains"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.4).
     */
    contains?: Schema | null;
    /**
     * The `default` keyword.
     *
     * See [JSON Schema Validation 9.2. "default"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.2).
     */
    default?: {
        [k: string]: unknown;
    };
    /**
     * The `deprecated` keyword.
     *
     * See [JSON Schema Validation 9.3. "deprecated"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.3).
     */
    deprecated?: boolean;
    /**
     * The `description` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    description?: string | null;
    /**
     * The `else` keyword.
     *
     * See [JSON Schema 9.2.2.3. "else"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.3).
     */
    else?: Schema | null;
    /**
     * The `enum` keyword.
     *
     * See [JSON Schema Validation 6.1.2. "enum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.2)
     */
    enum?: true[] | null;
    /**
     * The `examples` keyword.
     *
     * See [JSON Schema Validation 9.5. "examples"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.5).
     */
    examples?: true[];
    /**
     * The `exclusiveMaximum` keyword.
     *
     * See [JSON Schema Validation 6.2.3. "exclusiveMaximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.3).
     */
    exclusiveMaximum?: number | null;
    /**
     * The `exclusiveMinimum` keyword.
     *
     * See [JSON Schema Validation 6.2.5. "exclusiveMinimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.5).
     */
    exclusiveMinimum?: number | null;
    /**
     * The `format` keyword.
     *
     * See [JSON Schema Validation 7. A Vocabulary for Semantic Content With "format"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-7).
     */
    format?: string | null;
    /**
     * The `if` keyword.
     *
     * See [JSON Schema 9.2.2.1. "if"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.1).
     */
    if?: Schema | null;
    /**
     * The `items` keyword.
     *
     * See [JSON Schema 9.3.1.1. "items"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.1.1).
     */
    items?: SingleOrVecFor_Schema | null;
    /**
     * The `maxItems` keyword.
     *
     * See [JSON Schema Validation 6.4.1. "maxItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.1).
     */
    maxItems?: number | null;
    /**
     * The `maxLength` keyword.
     *
     * See [JSON Schema Validation 6.3.1. "maxLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.1).
     */
    maxLength?: number | null;
    /**
     * The `maxProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.1. "maxProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.1).
     */
    maxProperties?: number | null;
    /**
     * The `maximum` keyword.
     *
     * See [JSON Schema Validation 6.2.2. "maximum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.2).
     */
    maximum?: number | null;
    /**
     * The `minItems` keyword.
     *
     * See [JSON Schema Validation 6.4.2. "minItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.2).
     */
    minItems?: number | null;
    /**
     * The `minLength` keyword.
     *
     * See [JSON Schema Validation 6.3.2. "minLength"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.2).
     */
    minLength?: number | null;
    /**
     * The `minProperties` keyword.
     *
     * See [JSON Schema Validation 6.5.2. "minProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.2).
     */
    minProperties?: number | null;
    /**
     * The `minimum` keyword.
     *
     * See [JSON Schema Validation 6.2.4. "minimum"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.4).
     */
    minimum?: number | null;
    /**
     * The `multipleOf` keyword.
     *
     * See [JSON Schema Validation 6.2.1. "multipleOf"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.2.1).
     */
    multipleOf?: number | null;
    /**
     * The `not` keyword.
     *
     * See [JSON Schema 9.2.1.4. "not"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.4).
     */
    not?: Schema | null;
    /**
     * The `oneOf` keyword.
     *
     * See [JSON Schema 9.2.1.3. "oneOf"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.1.3).
     */
    oneOf?: Schema[] | null;
    /**
     * The `pattern` keyword.
     *
     * See [JSON Schema Validation 6.3.3. "pattern"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.3.3).
     */
    pattern?: string | null;
    /**
     * The `patternProperties` keyword.
     *
     * See [JSON Schema 9.3.2.2. "patternProperties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.2).
     */
    patternProperties?: {
        [k: string]: Schema;
    };
    /**
     * The `properties` keyword.
     *
     * See [JSON Schema 9.3.2.1. "properties"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.1).
     */
    properties?: {
        [k: string]: Schema;
    };
    /**
     * The `propertyNames` keyword.
     *
     * See [JSON Schema 9.3.2.5. "propertyNames"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.3.2.5).
     */
    propertyNames?: Schema | null;
    /**
     * The `readOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    readOnly?: boolean;
    /**
     * The `required` keyword.
     *
     * See [JSON Schema Validation 6.5.3. "required"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.5.3).
     */
    required?: string[];
    /**
     * The `then` keyword.
     *
     * See [JSON Schema 9.2.2.2. "then"](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-9.2.2.2).
     */
    then?: Schema | null;
    /**
     * The `title` keyword.
     *
     * See [JSON Schema Validation 9.1. "title" and "description"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.1).
     */
    title?: string | null;
    /**
     * The `type` keyword.
     *
     * See [JSON Schema Validation 6.1.1. "type"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.1.1) and [JSON Schema 4.2.1. Instance Data Model](https://tools.ietf.org/html/draft-handrews-json-schema-02#section-4.2.1).
     */
    type?: SingleOrVecFor_InstanceType | null;
    /**
     * The `uniqueItems` keyword.
     *
     * See [JSON Schema Validation 6.4.3. "uniqueItems"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-6.4.3).
     */
    uniqueItems?: boolean | null;
    /**
     * The `writeOnly` keyword.
     *
     * See [JSON Schema Validation 9.4. "readOnly" and "writeOnly"](https://tools.ietf.org/html/draft-handrews-json-schema-validation-02#section-9.4).
     */
    writeOnly?: boolean;
    [k: string]: unknown;
}
export interface ECDSADescriptors {
    Pk: Descriptor;
}
export interface TaprootDescriptors {
    XOnly: Descriptor;
}
/**
 * Metadata for Object, arbitrary KV set.
 */
export interface ObjectMetadata {
    /**
     * SIMP: Sapio Interactive Metadata Protocol
     */
    simp: {
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
/**
 * Template holds the data needed to construct a Transaction for CTV Purposes, along with relevant metadata
 */
export interface Template {
    /**
     * additional restrictions placed on this template
     */
    additional_preconditions: Policy[];
    /**
     * the amount being sent to this Template (TODO: currently computed via tx.total_amount())
     */
    max_amount_sats: number;
    /**
     * any metadata fields attached to this template
     */
    metadata_map_s2s?: TemplateMetadata;
    /**
     * the amount being sent to this Template (TODO: currently computed via tx.total_amount())
     */
    min_feerate_sats_vbyte?: number | null;
    /**
     * sapio specific information about all the outputs in the `tx`.
     */
    outputs_info: Output[];
    /**
     * the precomputed template hash for this Template
     */
    precomputed_template_hash: Hash;
    /**
     * the index used for the template hash. (TODO: currently always 0, although future version may support other indexes)
     */
    precomputed_template_hash_idx: number;
    /**
     * The actual transaction this template will create
     */
    transaction_literal: Transaction;
    [k: string]: unknown;
}
/**
 * Metadata Struct which has some standard defined fields and can be extended via a hashmap
 */
export interface TemplateMetadata {
    /**
     * A Color to render this node.
     */
    color?: string | null;
    /**
     * A Label for this transaction
     */
    label?: string | null;
    /**
     * SIMP: Sapio Interactive Metadata Protocol
     */
    simp: {
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
/**
 * An Output is not a literal Bitcoin Output, but contains data needed to construct one, and metadata for linking & ABI building
 */
export interface Output {
    /**
     * any metadata relevant to this contract
     */
    metadata_map_s2s?: OutputMeta;
    /**
     * the compiled contract this output creates
     */
    receiving_contract: Object;
    /**
     * the amount of sats being sent to this contract
     */
    sending_amount_sats: number;
    [k: string]: unknown;
}
/**
 * Metadata for outputs, arbitrary KV set.
 */
export interface OutputMeta {
    /**
     * SIMP: Sapio Interactive Metadata Protocol
     */
    simp: {
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
/**
 * A Bitcoin transaction, which describes an authenticated movement of coins.
 *
 * If any inputs have nonempty witnesses, the entire transaction is serialized in the post-BIP141 Segwit format which includes a list of witnesses. If all inputs have empty witnesses, the transaction is serialized in the pre-BIP141 format.
 *
 * There is one major exception to this: to avoid deserialization ambiguity, if the transaction has no inputs, it is serialized in the BIP141 style. Be aware that this differs from the transaction format in PSBT, which _never_ uses BIP141. (Ordinarily there is no conflict, since in PSBT transactions are always unsigned and therefore their inputs have empty witnesses.)
 *
 * The specific ambiguity is that Segwit uses the flag bytes `0001` where an old serializer would read the number of transaction inputs. The old serializer would interpret this as "no inputs, one output", which means the transaction is invalid, and simply reject it. Segwit further specifies that this encoding should *only* be used when some input has a nonempty witness; that is, witness-less transactions should be encoded in the traditional format.
 *
 * However, in protocols where transactions may legitimately have 0 inputs, e.g. when parties are cooperatively funding a transaction, the "00 means Segwit" heuristic does not work. Since Segwit requires such a transaction be encoded in the original transaction format (since it has no inputs and therefore no input witnesses), a traditionally encoded transaction may have the `0001` Segwit flag in it, which confuses most Segwit parsers including the one in Bitcoin Core.
 *
 * We therefore deviate from the spec by always using the Segwit witness encoding for 0-input transactions, which results in unambiguously parseable transactions.
 */
export interface Transaction {
    /**
     * List of transaction inputs.
     */
    input: TxIn[];
    /**
     * Block number before which this transaction is valid, or 0 for valid immediately.
     */
    lock_time: number;
    /**
     * List of transaction outputs.
     */
    output: TxOut[];
    /**
     * The protocol version, is currently expected to be 1 or 2 (BIP 68).
     */
    version: number;
    [k: string]: unknown;
}
/**
 * A transaction input, which defines old coins to be consumed
 */
export interface TxIn {
    /**
     * The reference to the previous output that is being used an an input.
     */
    previous_output: OutPoint;
    /**
     * The script which pushes values on the stack which will cause the referenced output's script to be accepted.
     */
    script_sig: Script;
    /**
     * The sequence number, which suggests to miners which of two conflicting transactions should be preferred, or 0xFFFFFFFF to ignore this feature. This is generally never used since the miner behaviour cannot be enforced.
     */
    sequence: number;
    /**
     * Witness data: an array of byte-arrays. Note that this field is *not* (de)serialized with the rest of the TxIn in Encodable/Decodable, as it is (de)serialized at the end of the full Transaction. It *is* (de)serialized with the rest of the TxIn in other (de)serialization routines.
     */
    witness: Witness;
    [k: string]: unknown;
}
/**
 * A transaction output, which defines new coins to be created from old ones.
 */
export interface TxOut {
    /**
     * The script which must be satisfied for the output to be spent.
     */
    script_pubkey: Script;
    /**
     * The value of the output, in satoshis.
     */
    value: number;
    [k: string]: unknown;
}
export interface Common {
    emulator?: EmulatorConfig | null;
    file?: OsString | null;
    key?: string | null;
    net: string;
    path: string;
    plugin_map?: {
        [k: string]: [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number
        ];
    } | null;
    [k: string]: unknown;
}
/**
 * EmulatorConfig is used to determine how this sapio-cli instance should stub out CTV. Emulators are specified by EPK and interface address. Threshold should be <= emulators.len().
 */
export interface EmulatorConfig {
    emulators: [string, string][];
    /**
     * if the emulator should be used or not. We tag explicitly for convenience in the config file format.
     */
    enabled: boolean;
    /**
     * threshold could be larger than u8, but that seems very unlikely/an error.
     */
    threshold: number;
    [k: string]: unknown;
}
export interface Response {
    result: ResultOf_CommandReturnOr_RequestError;
    [k: string]: unknown;
}
export interface ListReturn {
    items: {
        [k: string]: string;
    };
    [k: string]: unknown;
}
export interface CallReturn {
    result: object;
    [k: string]: unknown;
}
/**
 * A `Program` is a wrapper type for a list of JSON objects that should be of form: ```json { "hex" : Hex Encoded Transaction "color" : HTML Color, "metadata" : JSON Value, "utxo_metadata" : { "key" : "value", ... } } ```
 */
export interface Program {
    /**
     * program contains the list of SapioStudio PSBTs
     */
    program: {
        [k: string]: SapioStudioObject;
    };
    [k: string]: unknown;
}
/**
 * A `SapioStudioObject` is a json-friendly format for a `Object` for use in Sapio Studio
 */
export interface SapioStudioObject {
    /**
     * List of continue APIs from this point.
     */
    continue_apis: {
        [k: string]: ContinuationPoint;
    };
    /**
     * The object's metadata
     */
    metadata: ObjectMetadata;
    /**
     * The main covenant OutPoint
     */
    out: OutPoint;
    /**
     * List of SapioStudioFormat PSBTs
     */
    txs: SapioStudioFormat[];
    [k: string]: unknown;
}
export interface ApiReturn {
    api: APIFor_CreateArgsFor_AnyValueAnd_AnyValue;
    [k: string]: unknown;
}
/**
 * A bundle of input/output types
 */
export interface APIFor_CreateArgsFor_AnyValueAnd_AnyValue {
    /**
     * What is expected to be passed to the module
     */
    input: RootSchema;
    /**
     * What is expected to be returned from the module
     */
    output: RootSchema;
    [k: string]: unknown;
}
export interface LogoReturn {
    logo: string;
    [k: string]: unknown;
}
export interface InfoReturn {
    description: string;
    name: string;
    [k: string]: unknown;
}
export interface LoadReturn {
    key: string;
    [k: string]: unknown;
}
