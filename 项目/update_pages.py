import os

def update_html_files():
    # 获取当前目录下所有 html 文件
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                try:
                    file_path = os.path.join(root, file)
                    print(f'Processing: {file_path}')
                    
                    # 读取文件内容
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 计算到根目录的相对路径
                    rel_path = os.path.relpath('.', root)
                    rel_path = '' if rel_path == '.' else rel_path + '/'
                    
                    # 添加用户认证相关代码到 head
                    if '</head>' in content:
                        head_code = f'''
    <link href="{rel_path}css/userAuth.css" rel="stylesheet" type="text/css" media="all" />
    <script type="text/javascript" src="{rel_path}js/userAuth.js"></script>
</head>'''
                        content = content.replace('</head>', head_code)
                    
                    # 更新 header_top_right 部分
                    search_box_start = '<div class="header_top_right">'
                    if search_box_start in content:
                        new_header = f'''<div class="header_top_right">
          <div class="search_box">
            <!-- 用户状态显示区域 -->
            <div class="user-status">
              <!-- 未登录状态 -->
              <div id="guest-links" style="display: block;">
                <a href="{rel_path}login.html" class="auth-link">登录</a>
                <a href="{rel_path}register.html" class="auth-link">注册</a>
              </div>
              <!-- 已登录状态 -->
              <div id="user-info" style="display: none;">
                <span class="welcome-text">欢迎，</span>
                <span id="username-display"></span>
                <a href="javascript:void(0)" onclick="handleLogout()" class="logout-link">退出</a>
              </div>
            </div>
            <!-- 搜索框 -->
            <div class="search-area">
              <form action="{rel_path}search-results.html" method="get" id="searchForm">
                <input type="text" name="q" id="searchInput" placeholder="输入关键词">
                <input type="submit" value="搜索">
              </form>
            </div>
          </div>
        </div>'''
                        
                        # 查找并替换整个header_top_right部分
                        start_pos = content.find(search_box_start)
                        if start_pos != -1:
                            end_pos = content.find('</div>', start_pos)
                            while content.find('</div>', end_pos + 6) < content.find('<div class="clear"></div>', start_pos):
                                end_pos = content.find('</div>', end_pos + 6)
                            end_pos += 6
                            content = content[:start_pos] + new_header + content[end_pos:]
                    
                    # 添加用户状态检查脚本到 body 结束前
                    if '</body>' in content:
                        body_code = '''
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const user = getCurrentUser();
            updateUserDisplay(user.username);
        });
    </script>
</body>'''
                        content = content.replace('</body>', body_code)
                    
                    # 保存修改后的文件
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    print(f'Updated: {file_path}')
                
                except Exception as e:
                    print(f'Error processing {file_path}: {str(e)}')

if __name__ == '__main__':
    try:
        print('Starting update process...')
        update_html_files()
        print('Update completed successfully!')
    except Exception as e:
        print(f'Error: {str(e)}') 