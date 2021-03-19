/*

NOTE: tag is not supported in horizontal menu

Array of object

Top level object can be:
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- nav Grp (top level grp is called header group) ---/

title
icon (if it's on top/second level)
children

/--- nav Item (top level item is called header link) ---/

icon (if it's on top/second level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)

*/
import apps from './apps'
import attendance from './attendance'
import training from './training'
import pages from './pages'
import chartsAndMaps from './charts-and-maps'
import uiElements from './ui-elements'
import formAndTable from './forms-and-table'
import others from './others'
import docCenter from './doc-center'
import home from './home'

// Array of sections
export default [...home, ...docCenter, ...attendance, ...training, ...apps, ...uiElements, ...formAndTable, ...pages, ...chartsAndMaps, ...others]
