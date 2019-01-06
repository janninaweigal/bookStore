import AlipaySdk from 'alipay-sdk';

const alipaySdk = new AlipaySdk({
    appId: '2018122662722019',
    privateKey: fs.readFileSync('./private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./public-key.pem', 'ascii'),
});