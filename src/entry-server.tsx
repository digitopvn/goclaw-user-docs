// @refresh reload
import { appConfig, isLocal, isProd } from '@/config';
import { StartServer, createHandler } from '@solidjs/start/server';
import { getRequestEvent } from 'solid-js/web';

declare module '@solidjs/start/server' {
	interface RequestEventLocals {
		n: number;
		s: string;
		theme: string;
	}
}

export default createHandler(
	() => {
		// Get theme from request context (set by middleware)
		const event = getRequestEvent();
		const theme = event?.locals?.theme || 'light';

		return (
			<StartServer
				document={({ assets, children, scripts }) => (
					<html lang="en" class={theme}>
						<head>
							<meta charset="utf-8" />
							<meta
								name="viewport"
								content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, interactive-widget=resizes-content"
							/>

							<meta name="robots" content="index, follow" />
							<link rel="icon" type="image/x-icon" href={isLocal ? '/favicon-dev.ico' : '/favicon.ico'} />

							{isProd && (
								<>
									{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-DD32YH5X0B"></script>
									<script>
										{`window.dataLayer = window.dataLayer || [];
										function gtag(){dataLayer.push(arguments);}
										gtag('js', new Date());
										gtag('config', 'G-DD32YH5X0B');`}
									</script> */}
									{/* <script>
										{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
											new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
											j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
											'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
											})(window,document,'script','dataLayer','GTM-PS2L3P99');`}
									</script>
									<noscript>
										<iframe
											src="https://www.googletagmanager.com/ns.html?id=GTM-PS2L3P99"
											height="0"
											width="0"
											style="display:none;visibility:hidden"
										></iframe>
									</noscript> */}
								</>
							)}

							{assets}
						</head>

						<body>
							<div id="app">{children}</div>
							{scripts}
						</body>
					</html>
				)}
			/>
		);
	},
	{
		mode: 'async',
	}
);
