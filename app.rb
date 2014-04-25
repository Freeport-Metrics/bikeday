# http://stackoverflow.com/questions/15183938/what-option-do-i-have-for-embedded-http-https-server-for-ruby-app
require 'uri'
require 'net/http'
require 'webrick'

class Veturilo < WEBrick::HTTPServlet::AbstractServlet

  # Process the request, return response
  def do_GET(request, response)
    status, content_type, body = get_response(request)
    response.status = status
    response['Content-Type'] = content_type
    response.body = body
  end

  # Construct the return HTML page
  def get_response(request)
    url = "http://nextbike.net/maps/nextbike-official.xml?city=210"
    uri = URI.parse(url)
    params = {:city => 210}
    uri.query = URI.encode_www_form( params )

    response = Net::HTTP.get(uri)
    return 200, "text/html", response
  end

end

# Initialize our WEBrick server
if $0 == __FILE__ then
  server = WEBrick::HTTPServer.new(:Port => 8765)
  server.mount "/veturilo", Veturilo
  server.mount "/", WEBrick::HTTPServlet::FileHandler , './'
  trap "INT" do server.shutdown end
  server.start
end