# lambdas

These are functions that are deployed to AWS.

An util CLI is writed to help deploying these functions :
`yarn publish-lambda [--clean-all] [lambdaName]`

It needs to be in bash sheel and to have this AWS CLI installed:

```sh
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

## TODO:

- Test serverless to replace our custom util CLI
- How to tests lambdas ?
- Env var
- add timestamps to tables
- Cleanup tables time to time with https://docs.aws.amazon.com/fr_fr/lambda/latest/dg/services-cloudwatchevents-expressions.html
