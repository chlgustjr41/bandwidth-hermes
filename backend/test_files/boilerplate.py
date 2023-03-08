import aws_cdk as cdk
from aws_cdk import Stack
from constructs import Construct
class CdkWorkshopStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
app = cdk.App()
CdkWorkshopStack(app, 'Diagram')
app.synth()
