import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const widths = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440];

for (const width of widths) {
  test(`estrutura e responsividade em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await page.locator('.hero-art img').evaluate((img: HTMLImageElement) => img.decode());
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.activity-slide')).toHaveCount(10);
    await expect(page.locator('.bonus-card')).toHaveCount(5);
    await expect(page.locator('details')).toHaveCount(8);
    await expect(page.locator('details[open]')).toHaveCount(0);
    await expect(page.locator('main > section')).toHaveCount(8);
    await expect(page.locator('#video')).toHaveCount(0);
    await expect(page.locator('#depoimentos .testimonial-slide')).toHaveCount(3);
    await expect(page.locator('.checkout-button')).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
    if (width < 768) {
      const tops = await page.locator('.hero-grid > *').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
      expect(tops.every((top, index) => index === 0 || top > tops[index - 1])).toBeTruthy();
      const buttons = await page.locator('.hero-cta, .checkout-button, .final-cta .cta').evaluateAll(elements => elements.map(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height, right: element.getBoundingClientRect().right })));
      for (const button of buttons) { expect(button.height).toBeGreaterThanOrEqual(48); expect(button.right).toBeLessThanOrEqual(width); }
    }
    if ([360, 390, 430, 768, 1280].includes(width)) {
      await mkdir('artifacts/screenshots', { recursive: true });
      await page.screenshot({ path: `artifacts/screenshots/hero-${width}.png` });
      for (const target of ['.product-section', '#bonus', '#oferta', '.guarantee', '#duvidas', '#entrega']) {
        const element = page.locator(target);
        await element.evaluate(section => section.scrollIntoView({ block: 'start' }));
        await element.locator('img').evaluateAll(elements => Promise.all(elements.map(element => { const image = element as HTMLImageElement; image.loading = 'eager'; return image.decode(); })));
        await element.screenshot({ path: `artifacts/screenshots/${target.replace(/[.#]/g, '')}-${width}.png` });
      }
    }
  });
}

test('CTAs, checkout, preço anterior e ausência do cabeçalho e botão flutuante', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.sticky-cta, .site-header')).toHaveCount(0);
  await expect(page.locator('.reference-price s')).toHaveText('R$ 97,00');
  await page.locator('.hero-cta').click();
  await expect(page).toHaveURL(/#oferta$/);
  await page.locator('.final-cta .cta').click();
  await expect(page).toHaveURL(/#oferta$/);
  await expect(page.locator('.checkout-button')).toBeDisabled();
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test('oito perguntas abrem e fecham por teclado e toque', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/#duvidas');
  for (let index = 0; index < 8; index++) {
    const detail = page.locator('details').nth(index);
    const summary = detail.locator('summary');
    await summary.focus();
    await summary.press('Enter');
    await expect(detail).toHaveAttribute('open', '');
    await summary.press('Space');
    await expect(detail).not.toHaveAttribute('open');
    await summary.click();
    await expect(detail).toHaveAttribute('open', '');
    await summary.click();
    await expect(detail).not.toHaveAttribute('open');
  }
});

test('carrossel, lightbox, foco e fechamento com Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#materiais');
  const next = page.getByRole('button', { name: 'Próxima atividade', exact: true });
  await next.click();
  await expect(page.locator('.carousel-bottom')).toContainText('02');
  const activity = page.getByRole('button', { name: 'Ampliar: Crianças negras criando um mural', exact: true });
  await activity.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fechar imagem ampliada', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Ampliar para ler os detalhes' }).click();
  await expect(page.locator('dialog')).toHaveClass(/is-zoomed/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(activity).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  const carousel = page.locator('.carousel-viewport').first();
  await carousel.evaluate(element => element.scrollIntoView({ block: 'start' }));
  await carousel.focus();
  await carousel.press('ArrowRight');
  await expect(page.locator('.carousel-bottom')).toContainText('03');
});

test('movimento contínuo, pausa, retomada e pausa fora da viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#materiais');
  const track = page.locator('.carousel-track');
  const transform = () => track.evaluate(element => getComputedStyle(element).transform);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1400);
  const first = await transform();
  await page.waitForTimeout(500);
  expect(await transform()).not.toBe(first);
  await page.getByRole('button', { name: 'Pausar movimento automático' }).click();
  await page.waitForTimeout(250);
  const paused = await transform();
  await page.waitForTimeout(500);
  expect(await transform()).toBe(paused);
  await page.getByRole('button', { name: 'Retomar movimento automático' }).click();
  await page.waitForTimeout(1400);
  expect(await transform()).not.toBe(paused);
  await page.locator('#oferta').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const outside = await transform();
  await page.waitForTimeout(500);
  expect(await transform()).toBe(outside);
});

test('movimento reduzido impede autoplay inclusive após interação', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#materiais');
  const track = page.locator('.carousel-track');
  const transform = () => track.evaluate(element => getComputedStyle(element).transform);
  const first = await transform();
  await page.waitForTimeout(1500);
  expect(await transform()).toBe(first);
  await expect(page.getByRole('button', { name: 'Pausar movimento automático' })).toBeDisabled();
  await page.getByRole('button', { name: 'Próxima atividade', exact: true }).click();
  await page.waitForTimeout(1000);
  const after = await transform();
  await page.waitForTimeout(1200);
  expect(await transform()).toBe(after);
});

test('arraste por mouse e orientação horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/#materiais');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  const carousel = page.locator('.carousel-viewport').first();
  await carousel.evaluate(element => element.scrollIntoView({ block: 'start' }));
  const box = await carousel.boundingBox();
  if (!box) throw new Error('Carrossel não encontrado');
  const before = await page.locator('.carousel-track').evaluate(element => getComputedStyle(element).transform);
  await page.mouse.move(box.x + box.width * .7, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .2, box.y + 80, { steps: 14 });
  await page.mouse.up();
  await page.waitForTimeout(500);
  expect(await page.locator('.carousel-track').evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('acessibilidade automatizada da página', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('gesto de toque mantém swipe horizontal e rolagem vertical', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:31317/#materiais');
  const carousel = page.locator('.carousel-viewport').first();
  await carousel.evaluate(element => element.scrollIntoView({ block: 'start' }));
  const session = await context.newCDPSession(page);
  const before = await page.locator('.carousel-track').evaluate(element => getComputedStyle(element).transform);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y: 180 }] });
  for (let index = 1; index <= 12; index++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 310 - 19 * index, y: 180 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(500);
  expect(await page.locator('.carousel-track').evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const scrollBefore = await page.evaluate(() => scrollY);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 330 }] });
  for (let index = 1; index <= 12; index++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: 330 - index * 16 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(scrollBefore + 30);
  await context.close();
});

test('loop do último ao primeiro material preserva dez slides únicos', async ({ page }) => {
  await page.goto('/#materiais');
  const next = page.getByRole('button', { name: 'Próxima atividade', exact: true });
  for (let index = 0; index < 9; index++) await next.click();
  await expect(page.locator('.carousel-bottom')).toContainText('10');
  await next.click();
  await expect(page.locator('.carousel-bottom')).toContainText('01');
  await expect(page.locator('.activity-slide')).toHaveCount(10);
  const first = page.getByRole('button', { name: 'Ampliar: Cuidado e participação no jardim escolar', exact: true });
  const viewportBox = await page.locator('.carousel-viewport').first().boundingBox();
  const firstBox = await first.boundingBox();
  expect(firstBox && viewportBox && Math.abs(firstBox.x - viewportBox.x) < 25).toBeTruthy();
});

test('metrias locais de carregamento em produção, sem throttling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const metrics = { lcp: 0, cls: 0 };
    Object.assign(window, { __qaMetrics: metrics });
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      metrics.lcp = entries[entries.length - 1].startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const layout = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!layout.hadRecentInput) metrics.cls += layout.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await page.locator('.hero-art img').evaluate((image: HTMLImageElement) => image.decode());
  await page.waitForTimeout(700);
  const results = await page.evaluate(() => ({
    ...(window as unknown as { __qaMetrics: { lcp: number; cls: number } }).__qaMetrics,
    note: 'Chrome local, build de produção, sem throttling de rede/CPU. Não equivale a tráfego real nem Lighthouse mobile.',
    viewport: { width: innerWidth, height: innerHeight },
    resources: performance.getEntriesByType('resource').map(entry => { const resource = entry as PerformanceResourceTiming; return { url: resource.name, bytes: resource.transferSize, type: resource.initiatorType }; }),
  }));
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/local-performance.json', JSON.stringify(results, null, 2));
  expect(results.cls).toBeLessThan(.1);
});
