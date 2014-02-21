We're going to want to figure out useful, simple utilities at some point.
Maybe an admin page where rory can submit freeform database queries?
Can he do that via heroku? 
We're going to want a utility to compile the "THIS WEEK" blitz. 
We're going to want a utility to collect each of a number of selected
trip statistics during a given time period. 

How should we gracefully handle potentially fluctiating trip capacities?
Should people simply not get notified that they're actually on the trip
until the leader/heeler explicitly adds them, giving them permission?


Getting PostgreSQL running:
--------------------------

[Download and install PostgreSQL](http://www.postgresql.org/download/) using the default settings. Apparently there is a graphical app for OSX which lets you skip some of the following stuff, however I can't use it on my computer so you're on your own figuring it out... David, I'm not entirely sure how this plays with Linux. The OSX installer prompts for a password for the 'postgres' superuser account; not sure how that gets set up if you do an apt-get install. 

Add these aliases to your .bashrc file (make sure PSQL_HOME points to the directory in which PostgreSQL is installed):

```
# PostgreSQL setup
PSQL_HOME="/Library/PostgreSQL/9.3"
PSQL_DB="/usr/local/var/postgres"
export PATH="$PSQL_HOME/bin/:$PATH"
alias psql_init="pg_ctl initdb -D $PSQL_DB"
alias psql_start="pg_ctl -D $PSQL_DB -l $PSQL_DB/server.log start"
alias psql_stop="pg_ctl -D $PSQL_DB stop -s -m fast"
```
      
Be sure to export the aliases:
```
source ~/.bashrc
```

Initialize the Postgres database:
```
psql_init
```

Start Postgres server:
```
psql_start
```

Create the CnT signup db:
```
psql -d template1 -U postgres
```

When prompted, enter the password you choose when installing Postgres. At the psql prompt enter the following:
```
CREATE USER root WITH PASSWORD 'root';
CREATE DATABASE cnt;
GRANT ALL PRIVILEGES ON DATABASE cnt TO root;
\q
```

You should now be able to run the website.

Use `psql_stop` to stop the PostgreSQL server.