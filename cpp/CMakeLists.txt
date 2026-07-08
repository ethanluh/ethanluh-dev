cmake_minimum_required(VERSION 3.20)
project(template_repo_cpp LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# add_subdirectory(src)

option(BUILD_TESTING "Build tests" ON)
if(BUILD_TESTING)
    include(FetchContent)
    FetchContent_Declare(
        Catch2
        GIT_REPOSITORY https://github.com/catchorg/Catch2.git
        GIT_TAG v3.7.1
    )
    FetchContent_MakeAvailable(Catch2)

    enable_testing()
    # add_subdirectory(tests)
endif()
