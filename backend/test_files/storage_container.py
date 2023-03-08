import aws_cdk as cdk
from aws_cdk import Stack
from constructs import Construct
from aws_cdk import aws_s3 as s3
class CdkWorkshopStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        a1 = s3.Bucket(self, 's3bucket1',
            auto_delete_objects=True,
            public_read_access=False,
            removal_policy= cdk.RemovalPolicy.DESTROY
        )
app = cdk.App()
CdkWorkshopStack(app, 'mydiagramyyy')
app.synth()
