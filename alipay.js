import AlipaySdk from 'alipay-sdk';

const alipaySdk = new AlipaySdk({
    appId: '2016092400587087',
    privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./public-key.pem', 'ascii'),
});

// TypeScript
try {
    const result = await alipaySdk.exec('alipay.trade.page.pay', params, options);
  
    console.log(result);
  } catch (err) {
    // ...
  }