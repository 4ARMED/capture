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
$ sls deploy --stage dev
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (1.8 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.................................
Serverless: Stack update finished...
Service Information
service: capture
stage: dev
region: eu-west-1
stack: capture-dev
api keys:
  None
endpoints:
  POST - https://vwdo649wtd.execute-api.eu-west-1.amazonaws.com/dev/capture
functions:
  capture: capture-dev-capture
```



