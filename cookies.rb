#!/usr/bin/env ruby

require_relative "cookie_manager.rb"

CookieManager.new("data/cookie-responses.csv").run
