/** Optional browser APIs not in default TS DOM libs. */

interface NetworkInformation {
  readonly type?: string;
  readonly effectiveType?: string;
  readonly saveData?: boolean;
}

/** Minimal WebGPU surface for feature checks (full `GPU` may be missing from TS DOM lib). */
interface NavigatorGpu {
  requestAdapter?: (options?: object) => Promise<{ limits?: { maxStorageBufferBindingSize?: number } } | null>;
}

interface Navigator {
  readonly deviceMemory?: number;
  readonly connection?: NetworkInformation;
  readonly gpu?: NavigatorGpu;
}
