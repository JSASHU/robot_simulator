# Robot Simulator  

### Description

- The application is a simulation of a robot moving on a square tabletop, of dimensions 5 units x 5 units.    
- There are no other obstructions on the table surface.   
- The robot is free to roam around the surface of the table, but must be prevented prevented from falling. The robot must not fall off the table during movement. This also includes the initial
placement of the robot. Any movement that would result in the robot falling from the
table must be prevented.
Implement a way for the robot to handle the case when commands
are issued, but the robot is offline for 5 seconds.
Implement a way for the robot to handle more than one
command issuer

### System Dependencies & Configuration

To run the app, you'll need:

* [Node.js](https://nodejs.org/en/download/)
* [npm](https://www.npmjs.com/)   

## Application Installation Instructions

To get the application, just clone a repo,

`cd robot_simulator`
`cd client`
`npm  install`
`npm run start`

#### Constraints

The toy robot must not fall off the table during movement. This also includes the initial placement of the toy robot.

Any move that would cause the robot to fall must be ignored.

### Lambda Function Details

1. RoboSimulatorRegister :- This lambda takes hash as a parameter which contains userId and Password in encrypted format. Check user in redis and if present throw error that "user is already registerd" otherwise register the user.

2. RoboSimulatorLogin :- This lambda takes hash as a parameter which contains userId and Password in encrypted format. Check user in redis and if present then check for correct password. If password is correct then user logged in.

3. RoboSimulatorCmdExe :- This lambda takes user_token in headers and cmd,x,y,facing as event parameter. This lambda function perform appropriate command and update the sesion. This Lambda will take care of all commands execution.

4. RoboSimulatorQueueExe :- This lambda takes user_token in headers. This lambda execute after robot simulator comes online. All command which are given at robot offline are stored in session and this lambda executes those commands once robot comes online.

### Piller of the Application

1. React.js for front end framework
2. AwS Lambda Function
3. AWS API Gateway
4. AWS Elasticache (Redis)
5. Node.js