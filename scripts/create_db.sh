#!/usr/bin/env bash

DB=cntsignupdb
USER=root

psql template1 -c "CREATE USER $USER;"
psql template1 -c " CREATE DATABASE $DB;"
psql template1 -c " GRANT ALL PRIVILEGES ON DATABASE $DB TO $USER;"

