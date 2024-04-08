.PHONY : help
help :
	@echo "make serve:"
	@echo "\tRun HTTP server on http://localhost"

.PHONY : serve
serve :
	./HttpServer.py
