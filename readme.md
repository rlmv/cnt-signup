We're going to want to figure out useful, simple utilities at some point.
Maybe an admin page where rory can submit freeform database queries?
Can he do that via heroku? 
We're going to want a utility to compile the "THIS WEEK" blitz. 
We're going to want a utility to collect each of a number of selected
trip statistics during a given time period. 

How should we gracefully handle potentially fluctiating trip capacities?
Should people simply not get notified that they're actually on the trip
until the leader/heeler explicitly adds them, giving them permission?


auth/user middleware
--------------------
attaches the user object (pulled from the database) to the requests. Also exposes the user object in all templates; no need to pass {user: req.user} to res.render.


 