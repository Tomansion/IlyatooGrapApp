#############################################################################
# Imports
#############################################################################

from services.ilyatooManager import (
    get_linked_elements as get_linked_elements_from_db,
)

#############################################################################
# Works Management
#############################################################################


def get_element_by_name(element_name):
    elements = get_linked_elements_from_db(element_name)
    return elements, 200
