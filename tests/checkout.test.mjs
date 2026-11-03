import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkoutDestination } from '../src/lib/checkout.ts';

test('checkout ausente ou inválido permanece desativado', () => {
  for (const value of ['', '#', 'javascript:alert(1)', 'data:text/html,test', 'https://']) {
    assert.equal(checkoutDestination(value, '?utm_source=instagram'), '');
  }
});

test('preserva os parâmetros e o fragmento do checkout', () => {
  const destination = new URL(checkoutDestination('https://checkout.example/compra?product=abc&utm_source=checkout#pagar', '?utm_source=instagram&utm_campaign=kit'));
  assert.equal(destination.searchParams.get('utm_source'), 'checkout');
  assert.equal(destination.searchParams.get('product'), 'abc');
  assert.equal(destination.searchParams.get('utm_campaign'), 'kit');
  assert.equal(destination.hash, '#pagar');
});

test('transfere apenas UTMs conhecidas e fbclid, sem propagar dados arbitrários', () => {
  const destination = new URL(checkoutDestination('https://checkout.example/compra', '?utm_source=instagram&utm_medium=cpc&utm_campaign=kit&utm_content=criativo&utm_term=professores&utm_id=123&fbclid=meta-click&email=particular&token=secreto&outro=1'));
  assert.equal(destination.searchParams.size, 7);
  assert.equal(destination.searchParams.get('fbclid'), 'meta-click');
  assert.equal(destination.searchParams.has('email'), false);
  assert.equal(destination.searchParams.has('token'), false);
  assert.equal(destination.searchParams.has('outro'), false);
});

test('mantém UTF-8 e caracteres especiais sem corromper os parâmetros', () => {
  const destination = new URL(checkoutDestination('https://checkout.example/compra', '?utm_campaign=consci%C3%AAncia+negra&utm_content=a%26b%3Dc'));
  assert.equal(destination.searchParams.get('utm_campaign'), 'consciência negra');
  assert.equal(destination.searchParams.get('utm_content'), 'a&b=c');
});

test('preserva os parâmetros do modelo de URL dos anúncios Meta no checkout', () => {
  const template = 'utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}';
  const destination = new URL(checkoutDestination('https://pay.lowify.com.br/checkout?product_id=VyL412', `?${template}`));
  assert.equal(destination.searchParams.get('product_id'), 'VyL412');
  assert.equal(destination.searchParams.get('utm_source'), 'FB');
  assert.equal(destination.searchParams.get('utm_campaign'), '{{campaign.name}}|{{campaign.id}}');
  assert.equal(destination.searchParams.get('utm_medium'), '{{adset.name}}|{{adset.id}}');
  assert.equal(destination.searchParams.get('utm_content'), '{{ad.name}}|{{ad.id}}');
  assert.equal(destination.searchParams.get('utm_term'), '{{placement}}');
});
