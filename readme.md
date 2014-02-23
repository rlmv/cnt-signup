Spec
======
**NOTE:** Because there is no fundamental difference between heelers and the general public (other than self-identification), the terms "heelers" and "others" are used synonomously throughout. 

Everyone should always have a nav menu with:
* Sign up for trips
* Lead a trip
* Manage my trips

"Sign up for trips" page layout:
--------------------------------
Leaders and heelers see the same thing. 
This lists all trips which meet all of the below conditions...
* In the future
* Has a leader
* The user has not signed up for
The leader's name should be a `mailto` email link
Signing up puts you on a waitlist (via the `WaitlistTrippeeSignup` association) as a trippee.  


"Lead a trip" page layout:
------------------------------
### Leaders see:
1. Add trip section
2. Claim a trip section
	* Shows all proposed trips in the future without leaders. Signing up will automatically make you the leader. 

### Others see:
1. Propose trip section
2. Claim a trip section	
	* Shows all created trips in the future without heelers. Signing up will set the "wantsToHeel" field of a signup instance to true. If the user has already signed up for the trip, signing up again here will *replace the the entries in their old signup instance, but not replace the acutal instance*. This ensures that the instance's `createdAt` field will be unchanged, maintaining an FCFS ordering for trip signups. 

The "add trip" and "propose trip" sections should look identical, but the backend should behave appropriately. 
The "claim a trip" sections should have signup forms for each trip and behave appropriately. 

"Mange my trips" page layout:
------------------------------
###Leaders see:
1. A link to the "My past trips" page
2. A "Trips I'm leading" section. 
	* If empty, say "You are not currently leading any trips." 
	* Link to each trip's "Trip Control" page.
3. An "Other Trips I'm on" section.
4. A "Trips I've requested to be on" section.

###Others see:
1. A link to the "My past trips" page
2. A "Trips I'm heeling" section. 
	* This should not appear if no trips are being heeled. 
	* Link to each trip's "Trip Control" page.
3. A "Trips I'm on" section.
4. A "Trips I've requested to be on" section. 

Both "Trips I'm on" and "Trips I've requested to be on" should look like the "Sign up for trips" listing, with additions...
* Have a "Drop trip" button (**Question**: What should this button's behavior be? Should we ask for an optional reason? Send email to leader and/or heeler? Just drop and require that leader/heeler check the site to be informed?)	
* Instead of the standard "Signup" form, display the user's current signup info, and allow them to change it by editing the contents of text fields and hitting "Update comments" or "Update dietary rescritions".
* If the user has requested to heel a trip, but has not been approved as a heeler, this should be indicated in that trip's listing. 


"My past trips" page layout:
-----------------------------
Sort from most recent to least recent. 
**EXTRA:** Have a "show trippees" expandable menu for each trip. At the bottom of the trippee listing should be a "blitz trip" button. 

"Trip control" page layout:
----------------------------
1. List all trip info
	* All of the trip's information fields should be updateable, ala the "Manage my trips" signup-editing. 
2. List all trippees. The trippee list...
	* Should be sorted into a "Waitlist" and an "Accepted" list. Obviously it should be possible to move trippees between these lists.
		* Moving somebody from "Waitlist" to "Accepted" should send that trippee an email notification. 
	* Should display each trippee's signup info, including desire to heel. 
	* The leader should be able to promote __ANY__ trippee to heeler, regardless of indicated desire to heel. 
		* Conversely, the leader should be able to demote a heeler to trippee. 
3. There should be a "blitz trip" button that adds the trip information to the email body.
	+ **QUESTION:** Should we offer a text field into which the message can be typed, or should we try to use the user's default mail program. Attachments are tricky via the site, but what will happen if somebody's using a Robo lobby computer and we use a `mailto`?
	+ **EXTRA:** It would be nice to allow the user to automatically attach the OPO medform or waiver.

To-Do
======
* Heroku Dataclips for Rory and other OPO administators
	*Related: Is there any advantage to an in-app utility to collect each of a number of selected trip statistics during a given time period?
* We need to figure out how to incorporate OPO in general. Julie needs to be able to check trips, for instance. 
* We're going to want a utility to compile the "THIS WEEK" blitz. 
* Work out how trips should be transferred between leaders/heelers
* Figure out protection for various parts of the site. The "Trip control" page, for instance, needs to be inaccessible by everyone except the trip's leader and heeler. 

Other
======

auth/user middleware
--------------------
attaches the user object (pulled from the database) to the requests. Also exposes the user object in all templates; no need to pass {user: req.user} to res.render.


 