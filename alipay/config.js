class AlipayConfig {
    // 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	static app_id = "";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    static merchant_private_key = "";
	
	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    static alipay_public_key = "./";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	static notify_url = "http://www.gaobaiwu.top:8099";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	static return_url = "http://www.gaobaiwu.top:8099";

	// 签名方式
	static sign_type = "RSA2";
	
	// 字符编码格式
	static charset = "utf-8";
	
	// 支付宝网关
	static gatewayUrl = "https://openapi.alipay.com/gateway.do";
	
	// 支付宝网关
	static log_path = "http://www.gaobaiwu.top:8099";
    constructor() {
        
    }
}