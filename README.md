# Capture

This is a very simple "Serverless" function that takes input from a POST request, emails it to you (via AWS SES) and then, optionally, performs a redirect to a URL specified in the query string.

Why would I write something like this? It's very handy when producing proof of concepts for [open redirection](https://www.owasp.org/index.php/Unvalidated_Redirects_and_Forwards_Cheat_Sheet) issues.

## Installation

You're going to need an AWS account and the [Serverless Framework](https://serverless.com/).

*WARNING*

If you deploy this code to AWS you _might_ get charged. That's up to you to know and pay for. That said, unless you really, really hammer this function, it normally doesn't cost you a penny.

### Steps

First thing to do is clone this repo.

```
$ git clone https://github.com/4armed/capture.git
```

Now set two environment variables for the to and from email addresses for the function.

```
$ export TO_ADDRESS="4ARMED Testing <someone@mailinator.com>"
$ export FROM_ADDRESS="4ARMED Capture <somethingelse@mailinator.com>"
```

Finally, you can push the function up to AWS. Make a note of the URL it provides you as that is the API Gateway location you will use when accessing your new Serverless function. Note that in the example below I specified the _dev_ stage. This is optional.

```
$ cd capture
$ sls deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (2.22 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.................................
Serverless: Stack update finished...
Service Information
service: capture
stage: prod
region: eu-west-1
stack: capture-prod
api keys:
  None
endpoints:
  POST - https://xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com/prod/capture
functions:
  capture: capture-prod-capture
```

So in this example, my URL was `https://xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com/prod/capture`.

#### Email verification

Before you can use this, you will need to verify the recipient you set in $TO_ADDRESS with AWS SES. If you have the AWS CLI installed (`pip install awscli`) this is a simple job of:

```
$ aws ses verify-email-identity --email-address someone@mailinator.com
```

You will receive an email to that address with a link that needs clicking to show you have access to that email box.

#### Testing

A simple cURL will do it.

```
$ curl -d 'This is a test' https://xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com/prod/capture
ok
```

If you want to specify a redirect, use the _target_ query string parameter.

```
$ curl -v -d 'This is a test' https://xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com/prod/capture?target=https://www.4armed.com/
*   Trying 54.230.14.102...
* TCP_NODELAY set
* Connected to xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com (54.230.14.102) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use h2
* Server certificate:
*  subject: CN=*.execute-api.eu-west-1.amazonaws.com
*  start date: Dec  6 00:00:00 2017 GMT
*  expire date: Dec  6 12:00:00 2018 GMT
*  subjectAltName: host "xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com" matched cert's "*.execute-api.eu-west-1.amazonaws.com"
*  issuer: C=US; O=Amazon; OU=Server CA 1B; CN=Amazon
*  SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x7fde1e804800)
> POST /prod/capture?target=https://www.4armed.com/ HTTP/2
> Host: xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Length: 14
> Content-Type: application/x-www-form-urlencoded
>
* Connection state changed (MAX_CONCURRENT_STREAMS updated)!
* We are completely uploaded and fine
< HTTP/2 302
< content-type: application/json
< content-length: 0
< location: https://www.4armed.com/
< date: Fri, 16 Mar 2018 23:44:24 GMT
< x-amzn-requestid: f4dc82b3-2973-11e8-911a-0b31388dd085
< x-amzn-trace-id: sampled=0;root=1-5aac56d8-d795cda6f1c652be0f282198
< x-cache: Miss from cloudfront
< via: 1.1 1e075734d681989d6cd80021b52ec2d1.cloudfront.net (CloudFront)
< x-amz-cf-id: P4VFTeAbbjvnwqSS6bDcca_1ng4qd-IN9S8TGsh79Z6sXSPRGMQXEA==
<
* Connection #0 to host xfv3tpk5ni.execute-api.eu-west-1.amazonaws.com left intact
```



