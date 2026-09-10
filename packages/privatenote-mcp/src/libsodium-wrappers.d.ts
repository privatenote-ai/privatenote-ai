declare module "libsodium-wrappers" {
  const sodium: {
    ready: Promise<void>;
    crypto_secretstream_xchacha20poly1305_keygen: () => Uint8Array;
    crypto_secretstream_xchacha20poly1305_init_push: (key: Uint8Array) => {
      state: unknown;
      header: Uint8Array;
    };
    crypto_secretstream_xchacha20poly1305_push: (
      state: unknown,
      message: Uint8Array,
      ad: Uint8Array | null,
      tag: number,
    ) => Uint8Array;
    crypto_secretstream_xchacha20poly1305_TAG_MESSAGE: number;
    crypto_secretstream_xchacha20poly1305_TAG_FINAL: number;
  };
  export default sodium;
}
