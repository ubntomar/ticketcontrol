kill -9 $(sudo netstat -tulpn |grep node | awk '{print $7}' |awk '{gsub(/[^[:digit:]]/, "", $0)}1') 

