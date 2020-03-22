# schedulizer
A small program that helped me find a schedule for 10 teams, that was limited by the following rules:
- Each team plays each round exactly once, against one other team
- Each team plays each game only once
- Each team plays each opponent only once

More background and how this program came to be in my blog: https://www.ontdeksels.nl/ontdeksel-26-17-jaar-later/ (Dutch).

Final schedule:

![Final schedule (box version)](https://github.com/gkruiger/schedulizer/blob/master/final-schedule-1.png "Final schedule (box version)")

And a pretty version:

![Final schedule (pretty version)](https://github.com/gkruiger/schedulizer/blob/master/final-schedule-2.png "Final schedule (pretty version)")

## Running the program
Find the following lines of code in the program to adjust them to your liking.

```
findSchedule(
    10,     // number of teams
    false   // pretty schedule?
);
```

Please be aware that this program can run for a long time, without any way to know in advance when it will finish.
If it ever will...
