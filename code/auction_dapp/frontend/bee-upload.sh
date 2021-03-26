#!/bin/bash

dist=$(mktemp)
tar -cvf $dist -C dist .
hash=$(curl --silent \
	-X POST -H "Content-Type: application/x-tar" \
	-H "Swarm-Index-Document: index.html" \
	--data-binary @${dist}\
	http://localhost:1633/dirs | jq '.reference')
hash="${hash%\"}"
hash="${hash#\"}"
rm ${dist}

echo "http://localhost:1633/bzz/${hash}/"
