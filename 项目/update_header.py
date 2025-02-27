import os

def update_file(filepath):
    try:
        print(f'正在处理文件: {filepath}')
        
        # 读取文件
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 计算相对路径
        rel_path = os.path.relpath('.', os.path.dirname(filepath))
        rel_path = '' if rel_path == '.' else rel_path + '/'
        
        # 新的完整 header 结构
        new_header = f'''<div class="header">
    <div class="wrap">
      <div class="header_top">
        <div class="logo">
          <a href="{rel_path}index.html"><img src="{rel_path}images/logo.png" alt="" /></a>
        </div>
        <div class="header_top_right">
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
        </div>
        <div class="clear"></div>
      </div>'''

        # 查找并替换整个 header 部分
        start = content.find('<div class="header">')
        if start != -1:
            end = content.find('<div class="navigation">', start)
            if end != -1:
                content = content[:start] + new_header + content[end:]

        # 添加 CSS 和 JS 引用
        if '</head>' in content:
            head_code = f'''
    <link href="{rel_path}css/userAuth.css" rel="stylesheet" type="text/css" media="all" />
    <script type="text/javascript" src="{rel_path}js/userAuth.js"></script>
</head>'''
            content = content.replace('</head>', head_code)

        # 添加初始化脚本
        if '</body>' in content:
            script = '''
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const user = getCurrentUser();
            if (user && user.username) {
                console.log('发现用户:', user.username);
                updateUserDisplay(user.username);
            } else {
                console.log('未找到用户信息');
            }
        });
    </script>
</body>'''
            content = content.replace('</body>', script)

        # 保存文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f'成功更新: {filepath}')
        
    except Exception as e:
        print(f'更新文件出错 {filepath}: {str(e)}')

def main():
    try:
        print('开始更新文件...')
        # 获取所有 HTML 文件
        for root, dirs, files in os.walk('.'):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    update_file(filepath)
        print('所有文件更新完成！')
    except Exception as e:
        print(f'执行出错: {str(e)}')

if __name__ == '__main__':
    main() 