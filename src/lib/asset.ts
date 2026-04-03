/** Simple asset URL helper */
import { appConfig, isLocal } from "@/config";

const asset = (src: string) => {
	if (isLocal) return src;
	return appConfig.getBaseUrl(src);
};

export default asset;
