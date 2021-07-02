# Update Pull Request Description

This github action replaces strings with regular expressions and updates a PR description.

# Usage

This action doesn't create a PR, but updates it. We recommend you should use this github action on pull request open.

```yml
name: Insert branch name to the PR description

on:
  pull_request:
    types:
      - opened

jobs:
  replace-description:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.head_ref }}

      - name: PR description replace
        uses: kaskar2008/action-pr-description-replace@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          find: '%BRANCH%'
          replace: ${{ github.head_ref }}
```

## Our use case

We have feature stands with a dynamic links based on a branch name. In the PR Template we got `%BRANCH%` string to replace as a part of a link.

```yml
name: Update stand link

on:
  pull_request:
    types:
      - opened

jobs:
  replace-description:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.head_ref }}

      - name: Prepare branch name
        id: prepared_branch_name
        uses: frabert/replace-string-action@v2.0
        with:
          pattern: '\/'
          string: ${{ github.head_ref }}
          replace-with: '-'

      - name: PR description replace
        uses: kaskar2008/action-pr-description-replace@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          find: '%BRANCH%'
          replace: ${{ steps.prepared_branch_name.outputs.replaced }}
```

# Parameters

## Inputs

### `github_token`

The GITHUB_TOKEN secret. This is required.

### `find`

What to find (could be a regex).

### `replace`

Replace found part with.

### `number`

Pull Request number (if you are using triger, that is different from `"pull_request"`)

## Outputs

### `body`

Updated PR body (description)