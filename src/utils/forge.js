/* eslint-disable */ 
import forge from 'node-forge'
const KEY = 'MIICpDCCAYygAwIBAgIQN2xznCyPSWe/5PCdX0IIETANBgkqhkiG9w0BAQsFADAOMQwwCgYDVQQLDANHNGIwHhcNMTgwNDI0MDgzOTQ4WhcNMTgwNTExMDkyMDE2WjAOMQwwCgYDVQQLDANHNGIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCwxZuQ6CZk9gCs09bpk5O8iV/3yn6+dxsWhCIM5ez424TkxL6hhVXreXh9vNMDyduxhxm6DnNq5DETl3eN7VnXTcBy5DO8p99ynPR28yyFysUTQSeTkLnmcjVeVkKLGPiFoD4lh9Uk8OMVVDnFtqK21RS3V9qu09DqyLzgnMJQUgqX5/0niSBxxP7S27QvNaHJmNYHxhfx7B72L58Oq8UwFB+QRPyFgujSANdRP6pcLsZpc303Ra069uHNPUOVjzG/3sdyei4QbvH6iv5LhTLyNOXu3+olCPkRndn/aBeXDX3M6OAChSABeJ6zLrSYz0quUrkzMYD3TxvURhQPASnnAgMBAAEwDQYJKoZIhvcNAQELBQADggEBACfiY+gwI2nGt+ZipqDHmL4jLzvnUmKU+Zn6GCi3t4uIskoqtCK4cCxEgJ8FaOOk8xxJaxrdNwNQQbyYVRYgBfxWbcMCq6wasG92RvpxxQgl3olrTm6N+ELVCZ5iRI3gBlyIX/O0Twb28nWULGh0kPomVFargRPc3H+PUzboAfo7QXqASNXntGH0gre2xqEGnSl385Cbl7Qw6GtxU0UzAhJdnox142GZDBv6G+HN6NX7wqV2o+Sp61MVoY4m/M7/TvEl2zSEJAG2mmfGXwvetFCHM2E8kQvOKLMzwHcLnK16eyCQsy/auO6vK8JLdXswzHKRc+9Q1IMmmsXTxEa3Ugc='
const PUBLIC_KEY = `-----BEGIN CERTIFICATE-----\r\n${KEY}\r\n-----END CERTIFICATE-----\r\n`
// 获取公钥
export function getEncCertB64() {
  const keyPair = createKeypair()
  const cert = createCert(keyPair.pri, keyPair.pub)
  const encCertB64 = forge.pki.certificateToPem(cert)
  return {
    keyPair,
    cert,
    encCertB64
  }
}
// 获取证书需要
// 解密
export function envelopeDecrypt (cert, pri, data) {
  data = '-----BEGIN PKCS7-----' + data + '-----END PKCS7-----'
  const serP7 = forge.pkcs7.messageFromPem(data)
  const recipient = serP7.findRecipient(cert)
  serP7.decrypt(recipient, pri)
  return serP7.content
}
// 加密
export function envelopeEncrypt (data) {
  var certData = forge.pki.certificateFromPem(PUBLIC_KEY)
  var p7 = forge.pkcs7.createEnvelopedData()
  p7.addRecipient(certData)
  p7.content = forge.util.createBuffer(data, 'utf8')
  p7.encrypt(null, forge.pki.oids['des-EDE3-CBC'])

  var p7Pem = forge.pkcs7.messageToPem(p7)
  return p7Pem
}
// 创建密钥对
function createKeypair () {
  const keys = forge.pki.rsa.generateKeyPair(1024)
  return {
    pub: keys.publicKey,
    pri: keys.privateKey
  }
}
// 创建证书
function createCert (privateKeyData, publickeyData) {
  const cert = forge.pki.createCertificate()
  cert.privateKey = privateKeyData
  cert.publicKey = publickeyData
  /** 设置有效期 */
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)

  const attrs = [{
    name: 'organizationName',
    value: 'OU=G4B'
  }]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 6, // URI
      value: 'http://example.org/webid#me'
    }, {
      type: 7, // IP
      ip: '127.0.0.1'
    }]
  }, {
    name: 'subjectKeyIdentifier'
  }])
  cert.sign(privateKeyData)

  return cert
}

// md5加密
export function md5 (srcStr) {
  const md = forge.md.md5.create()
  md.update(srcStr)
  return md.digest().toHex()
}