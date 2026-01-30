declare module "argon2-browser" {
  export enum ArgonType {
    Argon2d = 0,
    Argon2i = 1,
    Argon2id = 2,
  }

  export interface HashOptions {
    pass: Uint8Array | string;
    salt: Uint8Array | string;
    time?: number;
    mem?: number;
    hashLen?: number;
    parallelism?: number;
    type?: ArgonType;
    distPath?: string;
  }

  export interface HashResult {
    hash: ArrayBuffer;
    hashHex: string;
    encoded: string;
  }

  export interface VerifyOptions {
    pass: Uint8Array | string;
    encoded: string;
    type?: ArgonType;
  }

  export function hash(options: HashOptions): Promise<HashResult>;
  export function verify(options: VerifyOptions): Promise<boolean>;

  const argon2: {
    ArgonType: typeof ArgonType;
    hash: typeof hash;
    verify: typeof verify;
  };

  export default argon2;
}
