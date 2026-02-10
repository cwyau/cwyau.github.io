Jekyll::Hooks.register [:posts, :pages], :pre_render do |doc|
  # Only process Markdown or HTML files
  next unless doc.extname =~ /^\.(md|html)$/

  creation_time = `git log --follow --format=%ad --date=iso -- "#{doc.path}" | tail -1`.strip
  doc.data['date'] = creation_time unless creation_time.empty?

  mod_time = `git log -1 --format=%ad --date=iso -- "#{doc.path}"`.strip
  doc.data['last_modified_at'] = mod_time unless mod_time.empty?
end
