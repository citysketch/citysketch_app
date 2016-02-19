"""
Simple types needed when describing cities.
"""

import collections


"""
A geographic location consisting of a latitude and longitude
"""
Location = collections.namedtuple('Location', ['lat', 'lng'])


"""
Information about the current time in a particular timezone.
"""
class LocalTime:
    def __init__(self, time, zone_name, zone_abbr):
        self.time = time
        self.zone_name = zone_name
        self.zone_abbr = zone_abbr

    def __str__(self):
        return "LocalTime(" + \
               ", ".join([repr(self.as_string()),
                          repr(self.zone_name),
                          repr(self.zone_abbr)]) + \
               ")"

    """
    Format the time as a string in the format <hour>:<minute> <AM/PM>
    """
    def as_string(self):
        import time
        return time.strftime('%I:%M %p', self.time)

