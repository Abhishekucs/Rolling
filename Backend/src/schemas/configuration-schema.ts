interface BaseSchema {
  type: string;
  label?: string;
  hint?: string;
}

interface NumberSchema extends BaseSchema {
  type: "number";
  min?: number;
}

interface BooleanSchema extends BaseSchema {
  type: "boolean";
}

interface StringSchema extends BaseSchema {
  type: "string";
}
interface ArraySchema<T extends unknown[]> extends BaseSchema {
  type: "array";
  items: Schema<T>[number];
}

interface ObjectSchema<T> extends BaseSchema {
  type: "object";
  fields: Schema<T>;
}

type Schema<T> = {
  [P in keyof T]: T[P] extends unknown[]
    ? ArraySchema<T[P]>
    : T[P] extends number
    ? NumberSchema
    : T[P] extends boolean
    ? BooleanSchema
    : T[P] extends string
    ? StringSchema
    : T[P] extends object
    ? ObjectSchema<T[P]>
    : never;
};

export const CONFIGURATION_FORM_SCHEMA: ObjectSchema<RollingTypes.Configuration> =
  {
    type: "object",
    label: "Server Configuration",
    fields: {
      maintenance: {
        type: "boolean",
        label: "In Maintenance",
      },
      users: {
        type: "object",
        label: "Users",
        fields: {
          signUp: {
            type: "boolean",
            label: "Sign Up Enabled",
          },
        },
      },
      product: {
        type: "object",
        label: "Product",
        fields: {
          submissionEnabled: {
            type: "boolean",
            label: "Submission Enabled",
          },
        },
      },
      address: {
        type: "object",
        label: "Address",
        fields: {
          submissionEnabled: {
            type: "boolean",
            label: "Submission Enabled",
          },
        },
      },
      admin: {
        type: "object",
        label: "Admin",
        fields: {
          endpointsEnabled: {
            type: "boolean",
            label: "Endpoints Enabled",
          },
        },
      },
      rateLimiting: {
        type: "object",
        label: "Rate Limiting",
        fields: {
          badAuthentication: {
            type: "object",
            label: "Bad Authentication Rate Limiter",
            fields: {
              enabled: {
                type: "boolean",
                label: "Enabled",
              },
              penalty: {
                type: "number",
                label: "Penalty",
                min: 0,
              },
              flaggedStatusCodes: {
                type: "array",
                label: "Flagged Status Codes",
                items: {
                  label: "Status Code",
                  type: "number",
                  min: 0,
                },
              },
            },
          },
        },
      },
    },
  };
