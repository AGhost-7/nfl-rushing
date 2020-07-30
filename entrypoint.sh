#!/usr/bin/env bash

set -e

yarn knex migrate:latest
yarn knex seed:run

exec $@
