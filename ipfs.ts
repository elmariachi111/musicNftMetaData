const IPFS_GATEWAY = 'https://ipfs.getsplice.io';
const IPFS_LOCATION_REGEX = new RegExp(`/ipfs/(.+)`, 'gi');

export const ipfsGW = (url: string): string => {
  if (url.startsWith("Qm")) return ipfsGW(`ipfs://${url}`);
  if (url.startsWith('ipfs://ipfs/'))
    return url.replace('ipfs://ipfs/', `${IPFS_GATEWAY}/ipfs/`);
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', `${IPFS_GATEWAY}/ipfs/`);
  } else {
    const i = url.indexOf('/ipfs/');
    if (i !== -1) {
      return `${IPFS_GATEWAY}${url.slice(i)}`;
    }
    return url;
  }
};