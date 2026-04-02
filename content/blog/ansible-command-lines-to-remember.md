---
title: "Ansible command lines to remember"
date: "2025-05-12"
excerpt: "Some personal notes of frequently used but lengthy Ansible commands that I often refer to."
tags: ["automation"]
---

[Ansible](https://docs.ansible.com/) is a powerful open-source tool for managing, deploying, and automating various aspects of your applications and infrastructure.

While I use Ansible often, this article isn't intended as a basic explanation of its features and functionalities. Therefore, if you're looking for an introductory guide, this might not be the right place. Instead, I'll be sharing some personal notes of frequently used but lengthy commands that I often refer to.

## Execute a Playbook

This command will execute the `deploy-application.yml` playbook on the hosts defined in the `inventory/application` inventory. It will attempt to connect to these hosts as the user `giulia`, prompt you for the password and the privilege escalation password, and execute the tasks in the playbook with elevated privileges, providing a verbose output of the execution.

```bash
ansible-playbook playbooks/dev/deploy-application.yml -i inventory/application -u giulia -b -k -K -vv
```

Let's explain it a bit deeper:

- `ansible-playbook playbooks/dev/deploy-application.yml` — executes the specified Ansible playbook file.
- `-i inventory/application` — specifies the inventory file or directory containing the target hosts.
- `-u giulia` — defines the username (`giulia`) used to connect to the remote servers.
- `-b` — enables privilege escalation (e.g., using `sudo`).
- `-k` — prompts for the password of the remote user (`giulia`).
- `-K` — prompts for the password for privilege escalation (if `-b` is used).
- `-vv` — increases the verbosity of the output during playbook execution.

## Tag Parameter

A nice, worth mentioning parameter is `tags`:

```bash
ansible-playbook playbooks/dev/deploy-application.yml -i inventory/application -u giulia -b -k -K --tags test -vv
```

The `--tags` parameter allows you to selectively run specific parts (tasks or plays) of your Ansible playbook. Playbooks can be organized with tags applied to individual tasks or blocks of tasks.

In this example, `--tags test` will instruct Ansible to only execute the tasks or plays within the `deploy-application.yml` playbook that have been tagged with the name `test`. Any tasks or plays without this tag will be skipped during this particular execution.

Tags are useful for various purposes, such as:

- Running only configuration tasks and skipping deployment tasks.
- Executing specific tests after a deployment.
- Targeting a subset of your infrastructure for a particular action.

## Vaults and Manage Secrets

[Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html) is a powerful feature that allows you to keep sensitive data, such as passwords, API tokens, and private keys, encrypted within your Ansible playbooks and roles. This prevents you from having to store this confidential information in plain text, significantly improving the security of your automation workflows.

The core principle behind Ansible Vault is symmetric encryption using a password. You encrypt your sensitive data using a password, and then you need to provide the same password (or a path to a file containing the password) when you want to decrypt and use that data in your Ansible runs.

Ansible Vault can encrypt individual files or specific variables within YAML files. When Ansible executes a playbook that uses Vault-encrypted data, it temporarily decrypts the necessary information in memory only for the duration of the task, ensuring that the sensitive data is not exposed unnecessarily.

**Encrypting a File**

```bash
ANSIBLE_VAULT_PASSWORD_FILE=~/secrets/password ansible-vault encrypt vault/prod/secret-vars.yml
```

- `ANSIBLE_VAULT_PASSWORD_FILE=~/secrets/password` — sets an environment variable that tells `ansible-vault` where to find the password needed for encryption. Ansible Vault will read the password from the file located at `~/secrets/password`.
- `ansible-vault encrypt` — tells `ansible-vault` to encrypt the specified file.
- `vault/prod/secret-vars.yml` — the path to the file you want to encrypt. After running this command, the contents of `secret-vars.yml` will be encrypted, and the original file will be overwritten with the encrypted version.

**Decrypting a File**

```bash
ANSIBLE_VAULT_PASSWORD_FILE=~/secrets/password ansible-vault decrypt vault/prod/secret-vars.yml
```

It's exactly the same as for the encryption, but it actually... decrypts.

## Ansible Galaxy: Sharing and Reusing Automation Content

[Ansible Galaxy](https://galaxy.ansible.com/) is a hub for finding, sharing, and managing Ansible roles and collections. The `ansible-galaxy` command-line tool is used to interact with Ansible Galaxy and manage these reusable pieces of automation. You can use it to search for, install, and manage roles and collections.

Let's look at this command:

```bash
ansible-galaxy install -r playbooks/dev/requirements.yml
```

- `ansible-galaxy` — the command-line tool used to interact with Ansible Galaxy.
- `install` — tells `ansible-galaxy` to install content. In this context, it's used to install Ansible roles (and potentially collections, depending on the `requirements.yml` file).
- `-r playbooks/dev/requirements.yml` — the `-r` or `--role-file` parameter specifies a file that lists the Ansible roles (and/or collections) that you want to install.

## Conclusion

We've explored a selection of essential Ansible commands that can significantly streamline your automation workflows. From deploying applications with `ansible-playbook` to managing reusable automation content with `ansible-galaxy` and safeguarding sensitive data with `ansible-vault`, these tools offer powerful capabilities for managing and orchestrating your infrastructure.

This guide provides a starting point, and the true power of Ansible lies in its extensive ecosystem of modules, plugins, and the flexibility to adapt it to your specific needs.
