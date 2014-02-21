We're going to want to figure out useful, simple utilities at some point.
Maybe an admin page where rory can submit freeform database queries?
Can he do that via heroku? 
We're going to want a utility to compile the "THIS WEEK" blitz. 
We're going to want a utility to collect each of a number of selected
trip statistics during a given time period. 

How should we gracefully handle potentially fluctiating trip capacities?
Should people simply not get notified that they're actually on the trip
until the leader/heeler explicitly adds them, giving them permission?


PostgreSQL:
---------

[Download and install PostgreSQL.](http://www.postgresql.org/download/) 

Add aliases to your .bashrc file (make sure PG_HOME points to the directory in which PostgreSQL is installed):

```
# PostgreSQL setup
PG_HOME="/Library/PostgreSQL/9.3"
PG_DB="/usr/local/var/postgres"
export PATH="$PG_HOME/bin/:$PATH"
alias psql_init="pg_ctl initdb -D $PG_DB"
alias psql_start="pg_ctl -D $PG_DB -l $PG_DB/server.log start"
alias psql_stop="pg_ctl -D $PG_DB stop -s -m fast"
```
      
Export aliases:
```
source ~/.bashrc
```

Initialize Postgres database:
```
psql_init
```

Start Postgres server:
```
psql_start
```

Create the CnT signup db:
```
./scripts/create_db.sh
```

You should now be able to run the website.