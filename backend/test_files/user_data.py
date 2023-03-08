import aws_cdk as cdk
from aws_cdk import Stack
from constructs import Construct
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_iam as iam
class CdkWorkshopStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        a1 = ec2.Vpc(self, 'VPC1', nat_gateways=1)
        a2_sg = ec2.SecurityGroup(self, 'my_web_server1-SecurityGroup', vpc=a1)
        a2_role=iam.Role(self, 'my_web_server1 Role', assumed_by=iam.ServicePrincipal('ec2.amazonaws.com'))
        a2_role.add_managed_policy(iam.ManagedPolicy.from_aws_managed_policy_name('AmazonSSMManagedInstanceCore'))
        a2 = ec2.Instance(self, 'my_web_server1',
            instance_type=ec2.InstanceType('t3.nano'),
            machine_image=ec2.MachineImage.generic_linux({"avail-zone": "asjdfla;jdfk"}),
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),
            vpc=a1,
            security_group=a2_sg,
            role=a2_role
        )
        a2.add_user_data('#!/bin/bash\nsudo su\nyum update -y\nyum install -y httpd\nsystemctl start httpd\nsystemctl enable httpd\necho \"<h1>Hello World from $(hostname -f)</h1>\" > /var/www/html/index.html')
        cdk.CfnOutput(self, 'my_web_server1 IP Address', value=a2.instance_public_ip)
        a2_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(80), 'Web Server')
app = cdk.App()
CdkWorkshopStack(app, 'my_diagram')
app.synth()
