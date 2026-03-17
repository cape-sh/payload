---
description:  Discover the power of CAEPE, a comprehensive solution for managing deployments, applications, and repositories. With its client component running seamlessly on actor machines, and a server component handling updates and backups on remote clusters, CAEPE ensures efficient management and seamless user experience. Learn more now!
---

# Architecture

CAEPE consists of a server and client component.

## Client component

The client component runs on actor machines (development, CI, and others) and handles the majority of CAEPE tasks. API endpoints used by CLI and GUI tools handle the following tasks:

- Management for deployments, applications, and repositories
- Backup and restores
- Hosts components management
- Hosts cluster management
- Federations management

The SaaS Operator handles all these API endpoints through a variety of custom resource definitions.

The CAEPE manager controller specifically handles deployments, components, and federations via Kubefed.

## Server component

The server component runs on remote clusters and handles updating application components running on the cluster, handling UI requests, and an instance of the Velero operator for backups.

<!-- TODO: Include image -->
