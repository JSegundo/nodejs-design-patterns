FROM node:14-alpine
# build on top of an existing image
EXPOSE 8080
# the app will be listening for tcp connections on the port 8080
COPY app.js package.json /app/
# containers cant share files with the host OS. we need to copy the project files into the container to access and exc them.
WORKDIR /app
# working directory for the container /app
CMD ["npm", "start"]
# command executed to start the app when we run a container from an image.
# we are able to run both node and npm in the
# container only because those two executables are made available through the
# base image.

# docker build .
#   look for Dockerfile to build container image
#   outputs container image ID: 0bb6c7f241..

# docker run -it -p 8080:8080 0bb6c7f24121655b464ddfb2846271c05dec776f64016e4145139719fe734f2d
#   run an instance of the container (will do 'npm start')
#   run the application from image bb3bd34bac55 in "interactive mode"
#   port 8080 of the container will be mapped to port 8080 of the host machine (our operating system).

# curl localhost:8080
#   Hello from 840f444c0a16 (v1)

###
###
###
### Run in Kubernetes.
### $ docker build -t hello-web:v1 .
### create a 'deployment' (Kubernetes object)
###    $ kubectl create deployment hello-web --image=hello-web:v1
###     output: deployment.apps/hello-web created
### verify the deployment is running:
###    $ kubectl get deployments
###    output: NAME        READY   UP-TO-DATE   AVAILABLE   AGE
###            hello-web   0/1     1            0           87s
###     our deployment is alive and there is one POD allocated (unit in k8s, represents a set of containers that have to run together in the same k8s node. containers in a same pod share resources)
###
### list pods runing
###     $ kubectl get pods
### to access the web server from our local machine, we need to 'EXPOSE' the deployment. 
###
### tell k8 tu create a LoadBalancer obj that exposes the instances of the hello-web app, connecting to port 8080 of every container
###    $ kubectl expose deployment hello-web --type=LoadBalancer --port=8080
###
### minikube helper command. get the local address to access the load balancer; will also open a browser window.
###    $ minikube service hello-web
###
### SCALING
### scale by running 5 instances
###     $ kubectl scale --replicas=5 deployment hello-web
###     deployment.apps/hello-web scaled
### 
###     $ kubectl get deployments
###         NAME        READY   UP-TO-DATE   AVAILABLE   AGE
###         hello-web   5/5     5            5           19m