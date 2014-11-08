output_handle = open('star.txt','w')
with open('stars.txt') as inf:
	for line in inf:
		parts = line.split() # split line into parts
		if len(parts) > 1:   # if at least 2 parts/columns
			output_handle.write('{"pos":[%s , %s, %s], "color": %s, "lum":%s },' %( 
				parts[0],parts[1],parts[2],parts[3],parts[4]))
output_handle.close()


# add [ and ] to beginning and end of file and remove final comma!