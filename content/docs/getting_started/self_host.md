# Self-hosting CAEPE application instances

You can run instances of the CAEPE application as a hosted instance, or self-host it on your own public cloud or on-premise infrastructure. This guide covers how to setup a self-hosted CAEPE application instance.

Create a self-hosted CAEPE application instance from the _CAEPE Application_ menu item and clicking the _Launch CAEPE Application_ button.

Clicking the button displays a command to copy and paste into a terminal. The command installs the CAEPE application on the instance just created.

The script installs helm for handling dependencies and then installs  and sets up those dependencies which include an NGINX ingress and the CAEPE helm charts. As part of this set up, the script configures your license and access details.

After issuing the command, the CAEPE application dashboard appears. You can login to the dashboard using the same credentials used to login to the portal.

The application dashboard provides an overview of cluster and application resources and their health.

---



This guide shows you how to install and setup CAEPE on a single Kubernetes cluster.

## Prerequisites

CAEPE uses Helm charts to install components, verify you have version 3.0.0 or higher with the following command:

```shell
helm version --short
```

## Add Helm repositories

CAEPE uses the NGINX ingress to manage access, first add it's Helm repository:

```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
```

Add the Helm repositories for the CAEPE resources:

```shell
helm repo add CAEPE https://charts.CAEPE.sh/
helm repo update
```

Verify that Helm added the repositories:

```shell
helm repo list
```

## Install Ingress

Install the NGINX ingress to the cluster with the following command:

```shell
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.replicaCount=2
```

Verify that Helm installed the ingress:

```shell
helm list -A
```

Get the public IP address of the Ingress controller and note it for later steps:

```shell
kubectl get svc -n ingress-nginx
```

## Install CAEPE

**NOTE**: [Temporarily you need to follow these steps](https://biqmind.atlassian.net/wiki/spaces/HYD/pages/2171863041/Quick+Setup+for+CAEPE#Temporary-workaround).

```shell
git clone git@github.com:biqmind/CAEPE-saas-operator.git -b develop
cd CAEPE-saas-operator/helm
```

<!-- TODO: Explain further -->

<!-- TODO: Update when you don't need to clone -->

Install the CAEPE components to the cluster with the following command, replacing `{EXTERNAL_IP}` with the public IP address of the Ingress controller:

```shell
helm upgrade --install   -f ./CAEPE/values.yaml CAEPE  ./CAEPE \
--set acceptTOS=true \
--set ingress.hostname={EXTERNAL_IP}  \
--set ingress.scheme=https \
--set scheme=https \
 --set licence="free10nodes" \
 --version 0.5.1
```

Verify that Helm installed the CAEPE components:

```shell
kubectl get pods -n CAEPE
```

**NOTE**: Temporarily you need to patch the image tags in the deployments:

```shell
kubectl edit deploy web -n CAEPE
```

- Change `CAEPEsh/CAEPE-api` to `preview-CAEPE-28` tag.
- Change `CAEPEsh/CAEPE-ui` to `dev2` tag or `v2` tag.

```shell
kubectl edit deploy manager -n CAEPE
```

- Change `CAEPEsh/CAEPE-manager` to `preview-CAEPE-212` tag.

Open the {EXTERNAL_IP} address to access the CAEPE UI.