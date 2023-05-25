/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "**",
			},
		],
	},
	experimental: {
		esmExternals: "loose",
		serverComponentsExternalPackages: ["mongoose"],
	},
	webpack: (config) => {
		config.experiments = { ...config.experiments, topLevelAwait: true };
		return config;
	},
};

module.exports = nextConfig;
