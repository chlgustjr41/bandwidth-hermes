import aws_cdk as cdk
from aws_cdk import Stack
from constructs import Construct
from aws_cdk import aws_ec2 as ec2
class CdkWorkshopStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        a1 = ec2.Vpc(self, 'MyVPC1', nat_gateways=1)
        a2 = ec2.Vpc(self, 'MyVPC2', nat_gateways=1)
app = cdk.App()
CdkWorkshopStack(app, 'Diagram')
app.synth()
