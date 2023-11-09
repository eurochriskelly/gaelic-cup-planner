select
	category,
	grp as groupNumber,
    (count(grp) * (count(grp) - 1) - sum(MatchesPlayed)) as remainingMatches
from v_group_standings 
-- where category = "Mens Junior"
group by category, grp