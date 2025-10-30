module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type enum - 실무에서 사용하는 타입들
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서만 변경
        'style',    // 코드 의미에 영향을 주지 않는 변경사항 (포맷팅, 세미콜론 누락 등)
        'refactor', // 버그를 수정하거나 기능을 추가하지 않는 코드 변경
        'perf',     // 성능 개선
        'test',     // 테스트 추가 또는 수정
        'build',    // 빌드 시스템 또는 외부 종속성에 영향을 미치는 변경사항
        'ci',       // CI 구성 파일 및 스크립트 변경
        'chore',    // 기타 변경사항 (소스 또는 테스트 파일을 수정하지 않음)
        'revert',   // 이전 커밋 되돌리기
      ],
    ],

    // Subject는 대문자로 시작하지 않음
    'subject-case': [2, 'never', ['upper-case']],

    // Subject는 마침표로 끝나지 않음
    'subject-full-stop': [2, 'never', '.'],

    // Subject 최소 길이
    'subject-min-length': [2, 'always', 10],

    // Subject 최대 길이
    'subject-max-length': [2, 'always', 100],

    // Body 최대 라인 길이
    'body-max-line-length': [2, 'always', 100],

    // Footer 최대 라인 길이
    'footer-max-line-length': [2, 'always', 100],

    // Type은 항상 소문자
    'type-case': [2, 'always', 'lower-case'],

    // Scope는 항상 소문자
    'scope-case': [2, 'always', 'lower-case'],
  },
};
