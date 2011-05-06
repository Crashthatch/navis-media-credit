/*
 * Monkey-patching the shortcode rendering functions from the built-in
 * wpEditImage tinymce plugin, located here:
 */

if ( tinymce != undefined && tinymce.plugins != undefined && tinymce.plugins.wpEditImage != undefined ) {
tinymce.plugins.wpEditImage.prototype._do_shcode = function(co) {
    return co.replace(/\[(?:wp_)?caption([^\]]+)\]([\s\S]+?)\[\/(?:wp_)?caption\][\s\u00a0]*/g, function(a,b,c){
            // b is caption args, c is html
            var id, cls, w, cap, div_cls, html;
            
            b = b.replace(/\\'|\\&#39;|\\&#039;/g, '&#39;').replace(/\\"|\\&quot;/g, '&quot;');
            c = c.replace(/\\&#39;|\\&#039;/g, '&#39;').replace(/\\&quot;/g, '&quot;');
            id = b.match(/id=['"]([^'"]+)/i);
            cls = b.match(/align=['"]([^'"]+)/i);
            w = b.match(/width=['"]([0-9]+)/);
            cap = b.match(/caption=['"]([^'"]+)/i);
            cred = b.match(/credit=['"]([^'"]+)/i);

            id = ( id && id[1] ) ? id[1] : '';
            cls = ( cls && cls[1] ) ? cls[1] : 'alignnone';
            w = ( w && w[1] ) ? w[1] : '';
            cap = ( cap && cap[1] ) ? cap[1] : '';
            cred = ( cred && cred[1] ) ? cred[1] : '';
            //if ( ! w || ( ! cap && ! cred ) ) return c;
            
            div_cls = (cls == 'aligncenter') ? 'mceTemp mceIEcenter' : 'mceTemp';

            if ( cls == 'alignleft' ) {
                cls = 'left';
            }
            else if ( cls == 'alignright' ) {
                cls = 'right';
            }

/*
            html = '<div id="' + id + '" class="module image ' + cls + ' ' + div_cls + '" draggable style="width: ' + parseInt( w ) + 'px;">' + c;
            if ( cred ) {
                html += '<p class="credit">' + cred + '</p>';
            }
            if ( cap ) {
                html += '<p class="caption">' + cap + '</p>';
            }
            html += '</div>';
            return html;
*/

            //return '<div class="'+div_cls+'" draggable><dl id="'+id+'" class="wp-caption '+cls+'" style="width: '+(10+parseInt(w))+ 'px"><dt class="wp-caption-dt">'+c+'</dt><dd class="wp-caption-dd">'+cap+ '</dd><dd class="wp-caption-dd">'+cred +'</dd></dl></div>';
            return '<div id="' + id + '" class="module image ' + cls + ' ' + div_cls + '" style="width: ' + parseInt( w ) + 'px;">' + c + '<p class="credit">' + cred + '</p><p class="caption">' + cap + '</p></div>';
    });
}

tinymce.plugins.wpEditImage.prototype._get_shcode = function(co) {
    //return co.replace(/<div class="mceTemp[^"]*">\s*<dl([^>]+)>\s*<dt[^>]+>([\s\S]+?)<\/dt>\s*<dd[^>]+>(.+?)<\/dd>\s*<dd[^>]+>(.+?)<\/dd>\s*<\/dl>\s*<\/div>\s*/gi, function(a,b,c,cap,cred){
    return co.replace(/<div([^>]+)>\s*(<(?:a|img).*?>)\s*<p class="credit">(.*?)<\/p>\s*<p class="caption">(.*?)<\/p><\/div>/gi, function(a,b,c,cred,cap) {
            var id, cls, w;
            
            id = b.match(/id=['"]([^'"]+)/i);
            cls = b.match(/class=['"]([^'"]+)/i);
            w = c.match(/width=['"]([0-9]+)/);

            id = ( id && id[1] ) ? id[1] : '';
            cls = ( cls && cls[1] ) ? cls[1] : 'right';
            w = ( w && w[1] ) ? w[1] : '';

            if ( ! w || ( ! cap && ! cred ) ) return c;
            cls = cls.match(/left|right|center/) || 'right';
            cap = cap.replace(/<\S[^<>]*>/gi, '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
            cred = cred.replace(/<\S[^<>]*>/gi, '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

            return '[caption id="'+id+'" align="'+cls+'" width="'+w+'" caption="'+cap+'" credit="'+ cred + '"]'+c+'[/caption]';
    });
}
}
