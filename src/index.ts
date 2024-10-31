import puppeteer from 'puppeteer';

function delay(time: number) {
	return new Promise(function(resolve) { 
			setTimeout(resolve, time)
	});
}

/** 
 * LISTA TODOS OS ARTIGOS PUBLICADOS POR MIM NO DEV.TO E RETORNA QUAL DELES TEM MAIS REAÇÕES
*/
(async () => {
	/** Cria uma instância do browser */
	const browser = await puppeteer.launch({ headless: true, args: ['--window-size=1200,800'] });
	
	/** Cria uma nova janela e navega até um site */
  const page = await browser.newPage();
  await page.goto('https://dev.to/guiselair', {
    waitUntil: 'networkidle2', // Aguarda até que não haja mais de 2 conexões de rede por pelo menos `500` ms.
  });
  
	/** Aguarda até todos os elementos serem carregados */
	await delay(500)
	const posts = await page.$$eval('div.crayons-story div.crayons-story__indention', (container) => {
		return container.map(post => {
			const rawReactions = post.querySelector('span.aggregate_reactions_counter')?.innerHTML;
			let reactionsTotal = Number(rawReactions?.split('<span')[0]);
			if (isNaN(reactionsTotal)) {
				reactionsTotal = 0;
			}

			return {
				title: post.querySelector('h2')?.innerText,
				reactions: reactionsTotal,
			}
		})
	})
	await browser.close();
	
	console.log('Posts: ', posts)
	console.log('Post com mais reações: ', posts.sort((a, b) => a.reactions > b.reactions ? -1 : 1)[0])
})()