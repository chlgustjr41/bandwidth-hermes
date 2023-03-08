import aws_cdk as cdk
from aws_cdk import Stack
from constructs import Construct
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_rds as rds
class CdkWorkshopStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        a1 = ec2.Vpc(self, 'VPC1', nat_gateways=1)
        a2_sg = ec2.SecurityGroup(self, 'my_database1-SecurityGroup', vpc=a1)
        a2 = rds.DatabaseInstance(self, 'my_database1',
            instance_type=ec2.InstanceType('t3.micro'), 
            engine=rds.DatabaseInstanceEngine.MYSQL,
            vpc=a1, 
            security_groups=[a2_sg],
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),
            credentials=rds.Credentials.from_generated_secret('mysql_user'),
            database_name='hermes-mydiagramyyy-my_database1',
            allocated_storage=10,
            multi_az=False
        )
        a2_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(3306), 'MySQL')
app = cdk.App()
CdkWorkshopStack(app, 'mydiagramyyy')
app.synth()
